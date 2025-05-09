import time
import streamlit as st


def relevant_ticket_details(response, number_of_tickets):
        for i in range(number_of_tickets):

            insurance_type = response["context"][i].metadata["Insurance Type"]
            vaccinated_date = response["context"][i].metadata["Vaccinated Week"]
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
    
