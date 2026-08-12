/* ==========================================================
   MindSense AI
   Prediction Controller
   ========================================================== */

import { predict } from "./api.js";

import {
    validateForm,
    initializeValidation,
    clearValidation
} from "./validation.js";

import {
    animateCounter,
    updateRiskBadge,
    setProgress,
    showLoader,
    hideLoader,
    showToast,
    formatDate
} from "./ui.js";

/* ==========================================================
   DOM Elements
========================================================== */

const form = document.getElementById("predictionForm");

const resultSection =
document.getElementById("predictionResult");

const scoreValue =
document.getElementById("scoreValue");

const progressCircle =
document.getElementById("progressCircle");

const riskBadge =
document.getElementById("riskBadge");

const predictionDate =
document.getElementById("predictionDate");

const predictionSummary =
document.getElementById("predictionSummary");

const predictButton =
document.getElementById("predictBtn");

const positiveFactors =
    document.getElementById("positiveFactors");

const negativeFactors =
    document.getElementById("negativeFactors");

const recommendationsSection =
    document.getElementById("recommendationsSection");

const recommendationsContainer =
    document.getElementById("recommendationsContainer");

const historyTable =
    document.getElementById("historyTable");

const downloadReport =
    document.getElementById("downloadReport");

const clearHistory =
    document.getElementById("clearHistory");

const disclaimerSection =
    document.getElementById("disclaimerSection");



/* ==========================================================
   Initialize
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeValidation(form);
    displayPredictionHistory();

});

/* ==========================================================
   Build Payload
========================================================== */

function buildPayload() {

    return {

        age: Number(form.age.value),

        gender: form.gender.value,

        country: form.country.value,

        academic_level: form.academic_level.value,

        most_used_platform: form.most_used_platform.value,

        purpose_of_use: form.purpose_of_use.value,

        avg_daily_usage_hours:
            Number(form.avg_daily_usage_hours.value),

        daily_unlocks:
            Number(form.daily_unlocks.value),

        study_hours:
            Number(form.study_hours.value),

        physical_activity_hours:
            Number(form.physical_activity_hours.value),

        sleep_hours_per_night:
            Number(form.sleep_hours_per_night.value),

        stress_level:
            form.stress_level.value

    };

}

/* ==========================================================
   Display Result
========================================================== */

function displayPrediction(score) {

    resultSection.classList.remove("hidden");

    if (disclaimerSection) {
    disclaimerSection.classList.remove("hidden");
      }

    animateCounter(
        scoreValue,
        score
    );

    setProgress(
        progressCircle,
        score * 10
    );

    updateRiskBadge(
        riskBadge,
        score
    );

    predictionDate.textContent =
        formatDate();

    predictionSummary.textContent =
        `The Machine Learning model predicts a mental health score of ${score.toFixed(2)} based on your lifestyle, sleep, stress, physical activity, and social media usage.`;

    resultSection.scrollIntoView({

        behavior: "smooth"

    });

}

/* ==========================================================
   SHAP Explanation
   ========================================================== */
function displayShapExplanation(explanation) {

    positiveFactors.innerHTML = "";
    negativeFactors.innerHTML = "";

    if (!explanation || explanation.length === 0) {

        positiveFactors.innerHTML =
            "<p>No explanation available.</p>";

        negativeFactors.innerHTML =
            "<p>No explanation available.</p>";

        return;
    }

    /* ==========================================================
       Features that should NOT appear in the user-facing
       SHAP explanation.

       These features may still be used by the ML model.
       We are only hiding them from the explanation UI.
       ========================================================== */

    const excludedFeatures = new Set([
        "age",
        "gender",
        "country",
        "academic level"
    ]);

    /* ==========================================================
       Normalize feature names so both formats work:

       "Academic Level"
       "academic_level"
       "academic-level"
       ========================================================== */

    function normalizeFeatureName(feature) {
        return String(feature || "")
            .trim()
            .toLowerCase()
            .replace(/[_-]+/g, " ");
    }

    /* ==========================================================
       Remove demographic/context features
       ========================================================== */

    const filteredExplanation = explanation.filter(item => {

        const normalizedFeature =
            normalizeFeatureName(item.feature);

        return !excludedFeatures.has(normalizedFeature);
    });

    if (filteredExplanation.length === 0) {

        positiveFactors.innerHTML =
            "<p>No relevant factors available.</p>";

        negativeFactors.innerHTML =
            "<p>No relevant factors available.</p>";

        return;
    }

    /* ==========================================================
       Find maximum SHAP impact for progress bars
       ========================================================== */

    const maxImpact = Math.max(
        ...filteredExplanation.map(
            item => Math.abs(Number(item.impact))
        )
    );

    /* ==========================================================
       Separate positive and negative factors
       ========================================================== */

    const positiveExplanation = filteredExplanation
        .filter(item => Number(item.impact) > 0)
        .sort(
            (a, b) =>
                Number(b.impact) - Number(a.impact)
        );

    const negativeExplanation = filteredExplanation
        .filter(item => Number(item.impact) < 0)
        .sort(
            (a, b) =>
                Math.abs(Number(b.impact)) -
                Math.abs(Number(a.impact))
        );

    /* ==========================================================
       Create SHAP card
       ========================================================== */

    function createShapCard(item) {

        const impact = Number(item.impact);

        const barWidth =
            maxImpact > 0
                ? (Math.abs(impact) / maxImpact) * 100
                : 0;

        const card = document.createElement("div");

        card.className =
            impact > 0
                ? "shap-item shap-positive"
                : "shap-item shap-negative";

        card.innerHTML = `
            <div class="shap-item-header">

                <strong>
                    ${item.feature}
                </strong>

                <span>
                    ${item.value}
                </span>

            </div>

            <div class="shap-bar">

                <div
                    class="shap-bar-fill"
                    style="width: ${barWidth}%;">
                </div>

            </div>

            <div class="shap-impact">

                <span>
                    ${
                        impact > 0
                            ? "↑ Increases score"
                            : "↓ Decreases score"
                    }
                </span>

                <strong>
                    ${impact > 0 ? "+" : ""}
                    ${impact.toFixed(4)}
                </strong>

            </div>
        `;

        return card;
    }

    /* ==========================================================
       Display positive factors
       ========================================================== */

    positiveExplanation.forEach(item => {

        positiveFactors.appendChild(
            createShapCard(item)
        );

    });

    /* ==========================================================
       Display negative factors
       ========================================================== */

    negativeExplanation.forEach(item => {

        negativeFactors.appendChild(
            createShapCard(item)
        );

    });

    /* ==========================================================
       Empty-state handling
       ========================================================== */

    if (positiveExplanation.length === 0) {

        positiveFactors.innerHTML =
            "<p>No factors increased the score.</p>";
    }

    if (negativeExplanation.length === 0) {

        negativeFactors.innerHTML =
            "<p>No factors decreased the score.</p>";
    }
}

function displayRecommendations(recommendations) {

    recommendationsContainer.innerHTML = "";

    if (!recommendations || recommendations.length === 0) {

        recommendationsContainer.innerHTML = `
            <div class="recommendation-empty">

                <i class="bi bi-check-circle"></i>

                <h3>No specific recommendations</h3>

                <p>
                    Your current inputs did not trigger
                    any specific recommendations.
                </p>

            </div>
        `;

        recommendationsSection.classList.remove("hidden");

        return;
    }

    recommendations.forEach(recommendation => {

        const card = document.createElement("div");

        card.className =
            `recommendation-card priority-${recommendation.priority}`;

        const priority =
            recommendation.priority.charAt(0).toUpperCase()
            + recommendation.priority.slice(1);

        const shapImpact =
            Number(recommendation.shap_impact || 0);

        let explanation = "";

        if (
            recommendation.model_related &&
            shapImpact < 0
         ) {
             explanation = `
                  <div class="recommendation-explanation">

                      <span class="explanation-label">
                          Why this recommendation?
                      </span>

                       <span class="explanation-text">
                       ${recommendation.related_feature}
                       decreased your predicted score by
                       ${Math.abs(shapImpact).toFixed(4)}.
                    </span>

                 </div>
                  `;
             }

        card.innerHTML = `

            <div class="recommendation-header">

                <div class="recommendation-icon">
                    <i class="bi bi-lightbulb"></i>
                </div>

                <div class="recommendation-title">

                    <h3>
                        ${recommendation.title}
                    </h3>

                    <span class="recommendation-priority">
                        ${priority} Priority
                    </span>

                </div>

            </div>

            <p class="recommendation-message">
                ${recommendation.message}
            </p>

            ${explanation}

            <div class="recommendation-footer">

                <span class="recommendation-feature">
                    <i class="bi bi-link-45deg"></i>
                    ${recommendation.related_feature}
                </span>

                ${
                    recommendation.model_related
                    ? `
                        <span class="recommendation-model">
                            <i class="bi bi-cpu"></i>
                            Model-related
                        </span>
                    `
                    : ""
                }

            </div>
        `;

        recommendationsContainer.appendChild(card);

    });

    recommendationsSection.classList.remove("hidden");
}


/* ==========================================================
   Prediction History
========================================================== */
async function displayPredictionHistory() {

    if (!historyTable) return;

    try {

        const response = await fetch(
            "/prediction-history"
        );

        if (!response.ok) {
            throw new Error("Failed to load prediction history.");
        }

        const history = await response.json();

        
        if (history.length === 0) {

            historyTable.innerHTML = `
                <tr>
                    <td colspan="4">
                        No previous predictions available.
                    </td>
                </tr>
            `;

            return;
        }

        historyTable.innerHTML = "";

        history.forEach(record => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${formatDate(new Date(record.created_at))}</td>
                <td>${Number(record.score).toFixed(2)}/10</td>
                <td>${record.risk}</td>
                <td>${record.status}</td>
            `;

            historyTable.appendChild(row);

        });

    } catch (error) {

        console.error(
            "Prediction history error:",
            error
        );

    }
}


async function clearPredictionHistory() {

    const confirmed = confirm(
        "Are you sure you want to delete all prediction history?"
    );

    if (!confirmed) {
        return;
    }

    try {

        const response = await fetch(
            "/prediction-history",
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            throw new Error(
                "Failed to clear prediction history."
            );
        }

        historyTable.innerHTML = `
            <tr>
                <td colspan="4">
                    No previous predictions available.
                </td>
            </tr>
        `;

        showToast(
            "Prediction history cleared successfully.",
            "success"
        );

    } catch (error) {

        console.error(
            "Clear history error:",
            error
        );

        showToast(
            "Unable to clear prediction history.",
            "error"
        );
    }
}

async function downloadPredictionReport() {

    try {

        const response = await fetch(
            "/download-report"
        );

        if (!response.ok) {
            throw new Error("Failed to generate report.");
        }

        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = "mindsense_report.pdf";

        document.body.appendChild(link);

        link.click();

        link.remove();

        window.URL.revokeObjectURL(url);

    } catch (error) {

        console.error(
            "Report download error:",
            error
        );

        showToast(
            "Unable to download report.",
            "error"
        );
    }
}

/* ==========================================================
   Submit Prediction
========================================================== */

async function submitPrediction(event) {

    event.preventDefault();

    if (!validateForm(form)) {

        showToast(
            "Please correct the highlighted fields.",
            "warning"
        );

        return;

    }

    const payload = buildPayload();

    try {

        predictButton.disabled = true;

        showLoader(
            "Generating prediction..."
        );

        const response =
            await predict(payload);

        
        

        hideLoader();

        displayPrediction(
            response.predicted_mental_health_score
            );

        displayShapExplanation(
             response.shap_explanation
                );
        
        displayRecommendations(
            response.recommendations
             );
    
        displayPredictionHistory();

        showToast(
            "Prediction generated successfully.",
            "success"
            );

    }

    catch (error) {

        hideLoader();

        console.error(error);

        showToast(
            error.message ||
            "Prediction failed.",
            "error"
        );

    }

    finally {

        predictButton.disabled = false;

    }

}

/* ==========================================================
   Reset Form
========================================================== */

function resetForm() {

    clearValidation(form);

    resultSection.classList.add("hidden");

}

form.addEventListener(
    "reset",
    resetForm
);

/* ==========================================================
   Submit Event
========================================================== */

form.addEventListener(
    "submit",
    submitPrediction
);

if (downloadReport) {

    downloadReport.addEventListener(
        "click",
        downloadPredictionReport
    );

}

if (clearHistory) {

    clearHistory.addEventListener(
        "click",
        clearPredictionHistory
    );

}