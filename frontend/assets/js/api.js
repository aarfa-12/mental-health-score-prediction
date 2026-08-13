/* ==========================================================
   MindSense AI
   API Service Layer
   ========================================================== */

/**
 * Change this when deploying
 *
 * Development:
 * http://127.0.0.1:8000
 *
 * Production:
 * https://your-api-domain.com
 */

const API_BASE_URL = "https://mental-health-score-prediction-61cy.onrender.com";

/* ----------------------------------------------------------
   Request Timeout
---------------------------------------------------------- */

const REQUEST_TIMEOUT = 15000;

/* ----------------------------------------------------------
   Generic Request Function
---------------------------------------------------------- */

async function request(endpoint, options = {}) {

    const controller = new AbortController();

    const timeoutId = setTimeout(() => {

        controller.abort();

    }, REQUEST_TIMEOUT);

    try {

        const response = await fetch(
            `${API_BASE_URL}${endpoint}`,
            {
                ...options,
                signal: controller.signal,
                headers: {
                    "Content-Type": "application/json",
                    ...(options.headers || {})
                }
            }
        );

        clearTimeout(timeoutId);

        let data = {};

        try {

            data = await response.json();

        } catch {

            data = {};

        }

        if (!response.ok) {

            throw new Error(
                data.detail ||
                data.message ||
                `HTTP ${response.status}`
            );

        }

        return data;

    }

    catch (error) {

        if (error.name === "AbortError") {

            throw new Error(
                "Request timed out. Please try again."
            );

        }

        throw error;

    }

}

/* ----------------------------------------------------------
   Health Check
---------------------------------------------------------- */

export async function healthCheck() {

    return await request("/");

}

/* ----------------------------------------------------------
   Prediction
---------------------------------------------------------- */

export async function predict(formData) {

    return await request("/predict", {

        method: "POST",

        body: JSON.stringify(formData)

    });

}

/* ----------------------------------------------------------
   Future Endpoint
---------------------------------------------------------- */

export async function recommend(formData) {

    try {

        return await request("/recommend", {

            method: "POST",

            body: JSON.stringify(formData)

        });

    }

    catch {

        return {

            recommendations: []

        };

    }

}

/* ----------------------------------------------------------
   Future Endpoint
---------------------------------------------------------- */

export async function explain(formData) {

    try {

        return await request("/explain", {

            method: "POST",

            body: JSON.stringify(formData)

        });

    }

    catch {

        return {

            shap_values: []

        };

    }

}

/* ----------------------------------------------------------
   Future Endpoint
---------------------------------------------------------- */

export async function modelInfo() {

    try {

        return await request("/model-info");

    }

    catch {

        return {

            algorithm: "",

            rmse: "",

            mae: "",

            r2: "",

            datasetSize: "",

            version: ""

        };

    }

}

/* ----------------------------------------------------------
   Connectivity Check
---------------------------------------------------------- */

export async function isBackendRunning() {

    try {

        await healthCheck();

        return true;

    }

    catch {

        return false;

    }

}

/* ----------------------------------------------------------
   Export Default
---------------------------------------------------------- */

export default {

    healthCheck,

    predict,

    recommend,

    explain,

    modelInfo,

    isBackendRunning

};