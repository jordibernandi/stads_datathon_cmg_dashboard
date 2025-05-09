import pandas as pd
from datetime import datetime
import google.generativeai as genai
import PIL.Image
import io
import base64
import os

context = ""
geminiAPI = os.getenv('gemini_hackathon')

def format_dateframe(from_date_str, to_date_str, kv_region=""):
    df = pd.read_csv("risk.csv")
    df.loc[df['gender'].isin(['x', 'v', 'u']), 'gender'] = 'o'
    if kv_region == "":
        new_df = df.copy()
    else:
        new_df = df[(df["kvregion"]==kv_region)]
    from_date = datetime.strptime(from_date_str, "%m/%d/%Y").date()
    to_date = datetime.strptime(to_date_str, "%m/%d/%Y").date()
    new_df["datetime_week"] = pd.to_datetime(new_df['datetime_week']).dt.date
    filtered_df = new_df[(new_df["datetime_week"] > from_date) & (new_df["datetime_week"] < to_date)]
    return filtered_df


def model_response(image, model_id = "gemini-2.0-flash-exp"):
  
    PROJECT_ID = "compact-record-199318"
    LOCATION = "us-central1"
    MODEL_ID = "gemini-2.0-flash-exp" 
    prompt = """
    Analyze the given image carefully. The image contains the graph related to flu vaccination.
    Look carefully at the x axis, y axis and the values. After careful observation, describe the content of the graph to a doctor.
    Explain without using the colour of the graph but rather use the values, labels and quantities.
    
    """
    genai.configure(api_key=geminiAPI)
    model = genai.GenerativeModel(model_id)
    response = model.generate_content(
        model=model_id,  
        contents=[Part.from_bytes(image, mime_type="image/png"),prompt,], 
        )
    # client = genai.GenerativeModel(api_key="")
    # response = client.models.generate_content(
    #   model=model_id,
    #   contents=[
    #       Part.from_bytes(image, mime_type="image/png"),
    #       prompt,
    #   ],      
    # )
    return response.text

def generate_text_from_image(image_path):
    """
    Generates text from an image using the Gemini Pro Vision model.

    Args:
        image_path: Path to the image file.
        prompt: Text prompt to guide the model.
        api_key: Your Google Generative AI API key.

    Returns:
        The generated text, or None if an error occurs.
    """
    genai.configure(api_key=geminiAPI)
    model = genai.GenerativeModel('gemini-2.0-flash-exp')
    prompt = """
    Analyze the given image carefully. The image contains the graph related to flu vaccination.
    Look carefully at the x axis, y axis and the values. After careful observation, describe the content of the graph to a doctor.
    Explain without using the colour of the graph but rather use the values, labels and quantities.
    
    """

    try:
        img = PIL.Image.open(image_path)
        response = model.generate_content([prompt, img])
        return response.text
    except FileNotFoundError:
        print(f"Error: Image file not found at {image_path}")
        return None
    except Exception as e:
        print(f"An error occurred: {e}")
        return None
    
def generate_text_from_base64(image_path):

    """
    Generates text from a base64 encoded image

    Args:
        base64_image: The base64 encoded image string.
        prompt: Text prompt to guide the model.
        api_key: Your Google Generative AI API key.

    Returns:
        The generated text, or None if an error occurs.
    """
    genai.configure(api_key=geminiAPI)
    model = genai.GenerativeModel('gemini-2.0-flash-exp')
    prompt = """
    QUESTIONS:
    1. Analyze the given image carefully. The image contains the graph related to flu vaccination.
    Look carefully at the x axis, y axis and the values. After careful observation, describe the content of the graph to a doctor.
    Explain without using the colour of the graph but rather use the values, labels and quantities.
    2. Explain the reason behind the values in the graph based on title of the graph, date, season, flu outbreak, and any other parameters etc.
    GUIDELINES:
    1. Do not write anything other than the required explanations.
    2. Answer to the point.
    3. Divide the text into paragraphs, one for each question asked.
    4. Do not provide numbering for paragraphs.
    5. Do not prpvide title to the text output.
    """
    base64_image = ""
    with open(image_path, "rb") as image_file:
        base64_image = base64.b64encode(image_file.read()).decode("utf-8")
    try:
        image_bytes = base64.b64decode(base64_image)
        img = PIL.Image.open(io.BytesIO(image_bytes))
        response = model.generate_content([prompt, img])
        return response.text
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def chatbot(history, question):
    genai.configure(api_key=geminiAPI)
    model = genai.GenerativeModel('gemini-2.0-flash-exp')
    prompt = f'''
    You are a medicine practitioner.
    Answer the question based on the previous chats:\n {history}.
    The new question is : {question}.
    
    GUIDELINES:
    1. Provide response like a chat.
    2. Only answer in 2 sentences.
    3. Answers should be concise and not detailed.
    '''
    response = model.generate_content([prompt])
    return response.text