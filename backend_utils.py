import pandas as pd
from datetime import datetime
import google.generativeai as genai
import PIL.Image
import io
import base64
# from google.generativeai.types import (
#     FunctionDeclaration,
#     # GenerateContentConfig,
#     # GoogleSearch,
#     # Part,
#     # Retrieval,
#     # SafetySetting,
#     Tool,
#     # VertexAISearch,
# )

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
    genai.configure(api_key="AIzaSyD_waaffGGKTm73y0flZItSsrO3VtAgrKE")
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
    genai.configure(api_key="AIzaSyD_waaffGGKTm73y0flZItSsrO3VtAgrKE")
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
    genai.configure(api_key="AIzaSyD_waaffGGKTm73y0flZItSsrO3VtAgrKE")
    model = genai.GenerativeModel('gemini-2.0-flash-exp')
    prompt = """
    Analyze the given image carefully. The image contains the graph related to flu vaccination.
    Look carefully at the x axis, y axis and the values. After careful observation, describe the content of the graph to a doctor.
    Explain without using the colour of the graph but rather use the values, labels and quantities.
    
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
