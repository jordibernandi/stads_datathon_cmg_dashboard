from datetime import datetime
from flask import Flask, jsonify, request
import io
import pandas as pd
from backend_utils import *
from flask_cors import CORS
import os

# plotting libs
import seaborn as sns
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from random import randint

app = Flask(__name__)
CORS(app)

history = ""

@app.route('/plot')
def dataframe_plots(df, x_val, y_val, hue_val, title_val, x_label):
    plt.figure(figsize=(12, 5))
    ax = sns.barplot(x=x_val, y=y_val, hue=hue_val, data=df)
    plt.xticks(rotation=45, ha='right')
    plt.xlabel(x_label)
    plt.title(title_val)

    labels = [item.get_text() for item in ax.get_xticklabels()]

    # Modify labels for two lines (example: split at the first space)
    new_labels = []
    for label in labels:
        parts = label.split(' ', 1)  
        if len(parts) > 1:
            new_labels.append(parts[0] + '\n' + parts[1])
        else:
            new_labels.append(label)  # If no space, keep the original label

    # Set the new labels
    ax.set_xticklabels(new_labels)

    plt.tight_layout()
    file_name = "Image/Image_to_LLM_" + str(randint(1, 100)) + ".jpg"
    plt.savefig(file_name)
    return file_name

@app.route('/state_age_gender_stats', methods=['POST'])
def state_age_gender_stats():
    data = request.get_json()
    from_date_str = data.get('fromDate')
    to_date_str = data.get('toDate')
    kv_region = data.get('kvRegion')

    filtered_df = format_dateframe(from_date_str, to_date_str, kv_region)
    final_df = filtered_df.groupby(["age_group", "gender"])["absolute"].sum().reset_index()
    json_data = final_df.to_json(orient='records')
    return jsonify(pd.read_json(io.StringIO(json_data)).to_dict(orient='records'))


@app.route('/state_age_risk_stats', methods=['POST'])
def state_age_risk_stats():
    data = request.get_json()
    from_date_str = data.get('fromDate')
    to_date_str = data.get('toDate')
    kv_region = data.get('kvRegion')

    filtered_df = format_dateframe(from_date_str, to_date_str, kv_region)
    final_df = filtered_df.groupby(["risk_groups","age_group"])["absolute"].sum().reset_index()
    json_data = final_df.to_json(orient='records')
    return jsonify(pd.read_json(io.StringIO(json_data)).to_dict(orient='records'))


@app.route('/state_gender_risk_stats', methods=['POST'])
def state_gender_risk_stats():
    data = request.get_json()
    from_date_str = data.get('fromDate')
    to_date_str = data.get('toDate')
    kv_region = data.get('kvRegion')

    filtered_df = format_dateframe(from_date_str, to_date_str, kv_region)
    final_df = filtered_df.groupby(["gender", "risk_groups"])["absolute"].sum().reset_index()
    json_data = final_df.to_json(orient='records')
    return jsonify(pd.read_json(io.StringIO(json_data)).to_dict(orient='records'))


@app.route('/state_vaccine_count', methods=['POST'])
def state_vaccine_count():
    data = request.get_json()
    from_date_str = data.get('fromDate')
    to_date_str = data.get('toDate')

    filtered_df = format_dateframe(from_date_str, to_date_str)
    filtered_df["name"] = filtered_df["kvregion"]
    filtered_df["vaccine_count"] = filtered_df["absolute"]
    filtered_df.drop(["kvregion", "absolute"], axis=1, inplace=True)
    final_df = filtered_df.groupby(["name"])["vaccine_count"].sum().reset_index()
    json_data = final_df.to_json(orient='records')
    return jsonify(pd.read_json(io.StringIO(json_data)).to_dict(orient='records'))


@app.route('/llm_generation_age_gender_stats', methods=['POST'])
def llm_generation_age_gender_stats():
    data = request.get_json()
    from_date_str = data.get('fromDate')
    to_date_str = data.get('toDate')
    kv_region = data.get('kvRegion')
    # x_axis = data.get('xAxis')
    # y_axis = data.get('yAxis')
    response= ""
    filtered_df = format_dateframe(from_date_str, to_date_str, kv_region)
    final_df = filtered_df.groupby(["age_group", "gender"])["absolute"].sum().reset_index()
    file_name = dataframe_plots(final_df, "age_group", "absolute", "gender",
                                 "Vaccination Count Grouped by Age group and Gender", "Flu Vaccination Count")
    
    response = generate_text_from_base64(file_name)
    os.remove(file_name)
    print(response)
    return {"response" : response}

@app.route('/llm_generation_age_risk_stats', methods=['POST'])
def llm_generation_age_risk_stats():
    data = request.get_json()
    from_date_str = data.get('fromDate')
    to_date_str = data.get('toDate')
    kv_region = data.get('kvRegion')
    # x_axis = data.get('xAxis')
    # y_axis = data.get('yAxis')
    response= ""
    filtered_df = format_dateframe(from_date_str, to_date_str, kv_region)
    final_df = filtered_df.groupby(["risk_groups", "age_group"])["absolute"].sum().reset_index()
    file_name = dataframe_plots(final_df, "age_group", "absolute", "risk_groups",
                                 "Vaccination Count Grouped by Age group and Risk Groups", "Flu Vaccination Count")
    
    response = generate_text_from_base64(file_name)
    os.remove(file_name)
    print(response)
    return {"response" : response}

@app.route('/llm_generation_gender_risk_stats', methods=['POST'])
def llm_generation_gender_risk_stats():
    data = request.get_json()
    from_date_str = data.get('fromDate')
    to_date_str = data.get('toDate')
    kv_region = data.get('kvRegion')
    # x_axis = data.get('xAxis')
    # y_axis = data.get('yAxis')
    response= ""
    filtered_df = format_dateframe(from_date_str, to_date_str, kv_region)
    final_df = filtered_df.groupby(["risk_groups", "gender"])["absolute"].sum().reset_index()
    file_name = dataframe_plots(final_df, "risk_groups", "absolute", "gender",
                                 "Vaccination Count Grouped by Risk Groups and Gender", "Flu Vaccination Count")
    
    response = generate_text_from_base64(file_name)
    os.remove(file_name)
    print(response)
    return {"response" : response}

@app.route('/llm_chatbot', methods=['POST'])
def llm_chatbot():
    global history
    data = request.get_json()
    incoming = data.get('question')
    response = chatbot(history, incoming)
    history = history + "Question:" + incoming + "LLM Response:" + response
    return {"response" : response}

if __name__ == '__main__':
    app.run(debug=True)