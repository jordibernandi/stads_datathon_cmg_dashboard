from langchain_qdrant import QdrantVectorStore
from langchain_openai import ChatOpenAI
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.schema import Document
from qdrant_client import models
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_openai import OpenAIEmbeddings
from langchain_together import Together
from langchain_core.prompts import PromptTemplate
from utils import open_ai_prompt

class RagModel():
    def __init__(self, api_keys, qdrant_api_key, qdrant_url, qdrant_collection_name,
                embedding_model, architecture = "", model="meta-llama/Meta-Llama-3.1-8B-Instruct", number_of_doc = 3):
        self.apikeys = api_keys
        self.qdrant_api_key = qdrant_api_key
        self.qdrant_url = qdrant_url
        self.qdrant_collection_name = qdrant_collection_name
        self.architecture = architecture
        self.model = model
        self.number_of_doc = number_of_doc
        if architecture == "openai":
            self.embedding = OpenAIEmbeddings(model = embedding_model,
                                               api_key = api_keys)
        else:
            self.embedding = HuggingFaceEmbeddings(model_name=embedding_model)

    def retrieve_data(self, user_input, resolved_ticket_flag):
        
        qdrant = QdrantVectorStore.from_existing_collection(
                            embedding = self.embedding,
                            collection_name = self.qdrant_collection_name,
                            url = self.qdrant_url,
                            api_key = self.qdrant_api_key,
                        )
        
        # THis is for metadata filtering. Only tickets which are Resolved will only be considered.
        if resolved_ticket_flag:
            filters = models.Filter(must=[models.FieldCondition(
                                key="metadata.absolute",
                                match=models.MatchValue(value=True),
                            ),])
            qdrant_retriever = qdrant.as_retriever(search_type="similarity", search_kwargs={"k": self.number_of_doc, "filter": filters})
        else:
            qdrant_retriever = qdrant.as_retriever(search_type="similarity", search_kwargs={"k": self.number_of_doc})
            

        if self.architecture == "openai":
            template = open_ai_prompt()
            llm = ChatOpenAI(model=self.model, api_key = self.apikeys)
        else:
            template = (                           
                        """<|begin_of_text|><|start_header_id|>system<|end_header_id|>
                        You are a doctors assistant designed to assist doctor by suggesting possible treatments or vaccinations based on past patients records.
                        Your task is to analyze the patients details and generate a suggestion based on the past retrieved context patient records.
                        Past retrieved patient record will have a Risk Group that is Specific risk group (if available else None), Gender, Region. 
                        
                        GUIDELINES:
                        1. Provide suggestion mainly based on retrieved context whether to take a Flu vaccination or not.
                        2. Keep the reasoning short and to the point by avoiding unnecessary explanations.
                        3. Avoid repetitive steps—ensure a structured approach.
                        4. Do not suggest any other vaccine other than Flu vaccination
                    
                        {context}
                        <|eot_id|>\n<|begin_of_text|><|start_header_id|>user<|end_header_id|>
                        Based ONLY on the provided tickets, suggest possible solution to the following question:
                        Question: {input}
                        Helpful Answer:
                        <|eot_id|>\n<|begin_of_text|><|start_header_id|>assistant<|end_header_id|>"""
                        )
            llm = Together(model=self.model, api_key = self.apikeys, temperature = 0.0)

        prompt = PromptTemplate(
            template=template, input_variables=["context", "input"]
        )

        
        question_answer_chain = create_stuff_documents_chain(llm, prompt)
        # This first retrieves relevant documents (past tickets) and merges retrieved docs into the prompt 
        # and then formats them into a query prompt for the llm
        rag_chain = create_retrieval_chain(qdrant_retriever, question_answer_chain)
        rag_response = rag_chain.invoke({"input": user_input})
        return rag_response 
    
    def upload_data(self, data):
        docs = []
        if "Unnamed: 0" in data.columns:
            data.drop("Unnamed: 0", axis=1, inplace=True)
        data.loc[data['gender'].isin(['x', 'v', 'u']), 'gender'] = 'o'
        data['risk_groups'] = data['risk_groups'].fillna("None")
        for _, row in data.iterrows():
            content = f"KV Region: {row['kvregion']}\n  Gender: {row['gender']}\n  Age Group: {row['age_group']}\n  Risk Group: {row['risk_groups']}"
            
            doc = Document(page_content=content,
                           metadata={"Insurance Type": row["insurancetype"],
                                    "Vaccinated Week": row["datetime_week"],
                                    "Vaccinated":row["absolute"]})
            docs.append(doc)
        new_collection_name = "New_Patient_Data_Collection"
        qdrant = QdrantVectorStore.from_documents(
                    docs,
                    embedding = self.embedding,
                    url = self.qdrant_url,
                    prefer_grpc=True,
                    api_key = self.qdrant_api_key,
                    collection_name =  new_collection_name,
                )
        
        return new_collection_name
    
