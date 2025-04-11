import time
import streamlit as st


def open_ai_prompt():
        system_prompt = (
                        """Role: System
                        You are an IT helpdesk assistant designed to assist support agents by suggesting solutions to technical issues based on past tickets - "Resolution".
                        Your task is to analyze the user entered ticket details and generate a resolution suggestion based on the past retrieved context tickets.
                        Past retrieved tickets will have an Issue, Description and Resolution. 

                        GUIDELINES:
                        1. Provide ONLY resolution suggestion based ONLY on retrieved context.
                        2. Never answer from your knowledge.
                        3. Keep the answer short and to the point by avoiding unnecessary explanations.
                        4. If the user question cannot be answered with the retrieved context respond strictly with: "No relevant similar ticket found for resolution suggestion"
                        5. Avoid repetitive steps—ensure a structured approach.

                        {context}
                        Based ONLY on the provided tickets, suggest possible solution to the following question:
                        Question: {input}
                        Helpful Answer:"""
                    )
        return system_prompt

def relevant_ticket_details(response, number_of_tickets):
        for i in range(number_of_tickets):

            insurance_type = response["context"][i].metadata["Insurance Type"]
            vaccinated_date = response["context"][i].metadata["Vaccinated Week"]
            # date = response["context"][i].metadata["Date"]

            # issue = response["context"][i].page_content.split("\n")[1]
            # ticket_resolution = response["context"][i].page_content.split("\n")[3]
            # resolution_status = response["context"][i].page_content.split("\n")[6]
            # category = response["context"][i].page_content.split("\n")[2]

            kv_region = response["context"][i].page_content.split("\n")[0]
            gender = response["context"][i].page_content.split("\n")[1]
            age_group = response["context"][i].page_content.split("\n")[2]
            risk_group = response["context"][i].page_content.split("\n")[3]

            st.subheader(f"Patient -> {age_group}")
            st.info(f"✅ Vaccinated Date {vaccinated_date}  \n 📝 Insurance Type {insurance_type}  \n 📌 {kv_region}  \n 👩‍💻 {gender}  \n 📝 {risk_group}")

def selectbox_styling():

    st.markdown(
        """
        <style>
        div[data-testid="stNumberInput"] {
            width: 660px !important; /* Adjust width as needed */
        }
        </style>
        """,
        unsafe_allow_html=True
    )

    st.markdown(
            """
            <style>
            div[data-testid="stSelectbox"] {
                width: 660px !important; /* Adjust width as needed */
            }
            </style>
            """,
            unsafe_allow_html=True
        )
    
    st.markdown(
            """
            <style>
            div[data-testid="stAlert"] {
                width: 660px !important; /* Adjust width as needed */
            }
            </style>
            """,
            unsafe_allow_html=True
        )
    
def response_generator(response):
    for word in response.split(" "):
        yield word + " "
        time.sleep(0.14)
    
