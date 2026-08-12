from io import BytesIO

from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from datetime import datetime



def format_report_date(value):

    try:

        date = datetime.fromisoformat(
            value
        )

        return date.strftime(
            "%d %B %Y at %I:%M %p"
        )

    except (ValueError, TypeError):

        return str(value)
    
    

def generate_prediction_report(prediction):

    buffer = BytesIO()

    pdf = SimpleDocTemplate(
        buffer,
        pagesize=A4
    )

    styles = getSampleStyleSheet()

    content = []

    # Title
    content.append(
        Paragraph(
            "MindSense AI - Mental Health Report",
            styles["Title"]
        )
    )

    content.append(Spacer(1, 20))

    # Prediction details
    content.append(
    Paragraph(
        f"<b>Date &amp; Time:</b> "
        f"{format_report_date(prediction['created_at'])}",
        styles["Normal"]
        )
     )

    content.append(
    Paragraph(
        f"<b>Score:</b> "
        f"{prediction['score']:.2f} / 10",
        styles["Normal"]
       )
    )

    content.append(
    Paragraph(
        f"<b>Risk:</b> "
        f"{prediction['risk']}",
        styles["Normal"]
       )
    )
    content.append(Spacer(1, 20))

    # Increasing factors
    content.append(
        Paragraph(
            "Factors Increasing Score",
            styles["Heading2"]
        )
    )

    for item in prediction["shap_explanation"]:

        if item["direction"] == "increases":

            content.append(
                Paragraph(
                    f"- {item['feature']} "
                    f"({item['impact']:.4f})",
                    styles["Normal"]
                )
            )

    content.append(Spacer(1, 15))

    # Decreasing factors
    content.append(
        Paragraph(
            "Factors Decreasing Score",
            styles["Heading2"]
        )
    )

    for item in prediction["shap_explanation"]:

        if item["direction"] == "decreases":

            content.append(
                Paragraph(
                    f"- {item['feature']} "
                    f"({item['impact']:.4f})",
                    styles["Normal"]
                )
            )

    content.append(Spacer(1, 15))

    # Recommendations
    content.append(
        Paragraph(
            "Recommendations",
            styles["Heading2"]
        )
    )
    print("RECOMMENDATIONS:", prediction["recommendations"])
    for item in prediction["recommendations"]:

        content.append(
            Paragraph(
                f"- {item['title']}",
                styles["Heading3"]
            )
        )
        
        content.append(
                    Paragraph(
                        f"- {item['message']}",
                        styles["Normal"]
                    )
                )

        content.append(Spacer(1, 8))


    content.append(Spacer(1, 20))

    # Disclaimer
    content.append(
        Paragraph(
            "<b>NOTE: This assessment is for informational purposes only "
            "and is not a medical diagnosis.</b>",
            styles["Normal"]
        )
    )

    pdf.build(content)

    buffer.seek(0)

    return buffer