/* ==========================================================
   MindSense AI
   Validation Module
   ========================================================== */

/* ==========================================================
   Validation Rules
========================================================== */

const rules = {
    age: { min: 10, max: 100 },
    avg_daily_usage_hours: { min: 0, max: 24 },
    daily_unlocks: { min: 0 },
    study_hours: { min: 0, max: 24 },
    physical_activity_hours: { min: 0, max: 24 },
    sleep_hours_per_night: { min: 0, max: 24 }
};

/* ==========================================================
   Show Error
========================================================== */

function showError(input, message) {

    input.classList.remove("input-success");
    input.classList.add("input-error");

    const errorElement =
        input.parentElement.querySelector(".error");

    if (errorElement) {
        errorElement.textContent = message;
    }
}

/* ==========================================================
   Clear Error
========================================================== */

function clearError(input) {

    input.classList.remove("input-error");

    const errorElement =
        input.parentElement.querySelector(".error");

    if (errorElement) {
        errorElement.textContent = "";
    }
}

/* ==========================================================
   Validate Required
========================================================== */

function validateRequired(input) {

    const value = input.value.trim();

    if (value === "") {

        showError(input, "This field is required.");

        return false;
    }

    return true;
}

/* ==========================================================
   Validate Numeric Range
========================================================== */

function validateNumber(input) {

    const config = rules[input.name];

    if (!config) {

        return true;

    }

    const value = Number(input.value);

    if (isNaN(value)) {

        showError(input, "Please enter a valid number.");

        return false;

    }

    if (
        config.min !== undefined &&
        value < config.min
    ) {

        showError(
            input,
            `Minimum allowed value is ${config.min}.`
        );

        return false;

    }

    if (
        config.max !== undefined &&
        value > config.max
    ) {

        showError(
            input,
            `Maximum allowed value is ${config.max}.`
        );

        return false;

    }

    return true;
}

/* ==========================================================
   Validate Single Field
========================================================== */

export function validateField(input) {

    clearError(input);

    if (!validateRequired(input)) {

        return false;

    }

    if (!validateNumber(input)) {

        return false;

    }

    input.classList.add("input-success");

    return true;
}

/* ==========================================================
   Validate Entire Form
========================================================== */

export function validateForm(form) {

    let isValid = true;

    const fields =
        form.querySelectorAll("input, select");

    fields.forEach(field => {

        if (!validateField(field)) {

            isValid = false;

        }

    });

    return isValid;
}

/* ==========================================================
   Live Validation
========================================================== */

export function initializeValidation(form) {

    const fields =
        form.querySelectorAll("input, select");

    fields.forEach(field => {

        field.addEventListener("input", () => {

            validateField(field);

        });

        field.addEventListener("change", () => {

            validateField(field);

        });

    });

}

/* ==========================================================
   Clear Validation
========================================================== */

export function clearValidation(form) {

    form.querySelectorAll("input, select")
        .forEach(field => {

            field.classList.remove(
                "input-error",
                "input-success"
            );

        });

    form.querySelectorAll(".error")
        .forEach(error => {

            error.textContent = "";

        });

}