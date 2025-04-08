import React from "react";
import "./Help.css";

const Help = () => {
  return (
    <div className="help-container">
      <div className="help-content">
        <h1>Help & FAQs</h1>

        <div className="faq">
          <h3>How do I use the BMI Calculator?</h3>
          <p>
            Enter your weight (in kg) and height (in cm) in the respective
            fields, then click "Calculate BMI" to get your result.
          </p>
        </div>

        <div className="faq">
          <h3>What is BMR, and why is it important?</h3>
          <p>
            BMR (Basal Metabolic Rate) is the number of calories your body needs
            to function at rest. Knowing your BMR helps you plan your daily
            calorie intake for weight management.
          </p>
        </div>

        <div className="faq">
          <h3>How do I calculate my body fat percentage?</h3>
          <p>
            Enter your weight, waist circumference, and other relevant
            measurements. The calculator estimates your body fat percentage
            based on these inputs.
          </p>
        </div>

        <div className="faq">
          <h3>What does the calorie calculator do?</h3>
          <p>
            The calorie calculator estimates how many calories you need each day
            based on your activity level, age, gender, weight, and goals (e.g.,
            weight loss, maintenance, or muscle gain).
          </p>
        </div>

        <div className="faq">
          <h3>How can the diabetes risk calculator help me?</h3>
          <p>
            The diabetes risk calculator assesses your likelihood of developing
            diabetes based on factors like age, BMI, family history, and
            lifestyle. It provides an estimated risk score to help you take
            preventive measures.
          </p>
        </div>

        <div className="faq">
          <h3>What is the body shape calculator for?</h3>
          <p>
            The body shape calculator helps you determine your body type (e.g.,
            pear, apple, rectangle) based on your measurements. This information
            can guide you in choosing tailored workout or nutrition plans.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Help;
