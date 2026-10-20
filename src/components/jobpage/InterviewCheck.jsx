import React, { useState } from 'react';

const InterviewCheck = () => {
  // State to manage checklist completion
  const [checklist, setChecklist] = useState({
    "Research the company": false,
    "Prepare your portfolio": false,
    "Review common interview questions": false,
    "Dress professionally": false,
    "Arrive on time": false,
    "Prepare questions to ask the interviewer": false,
    "Bring multiple copies of your resume": false,
  });

  // Toggle checkbox state
  const handleCheck = (item) => {
    setChecklist({
      ...checklist,
      [item]: !checklist[item],
    });
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <h1 style={styles.heading}>Interview Readiness Checklist</h1>
        <p style={styles.subheading}>Prepare yourself for success with this checklist!</p>

        <div style={styles.checklist}>
          {Object.keys(checklist).map((item) => (
            <div style={styles.checklistItem} key={item}>
              <input
                type="checkbox"
                checked={checklist[item]}
                onChange={() => handleCheck(item)}
                id={item}
                style={styles.checkbox}
              />
              <label htmlFor={item} style={checklist[item] ? styles.checkboxLabelChecked : styles.checkboxLabel}>
                {item}
              </label>
            </div>
          ))}
        </div>

        <button style={styles.ctaBtn}>Start Preparing</button>
        
        <div style={styles.additionalPoints}>
          <h2 style={styles.additionalHeading}>Common Interview Tips:</h2>
          <ul style={styles.tipList}>
            <li>Be punctual and arrive early for the interview.</li>
            <li>Make sure you’ve researched the company thoroughly.</li>
            <li>Prepare examples to demonstrate your skills and experiences.</li>
            <li>Dress appropriately for the company culture.</li>
            <li>Listen carefully and answer questions clearly and concisely.</li>
            <li>Ask insightful questions to show your interest in the role.</li>
            <li>Follow up with a thank you email after the interview.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
  },
  container: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '10px',
    width: '100%',
    boxSizing: 'border-box',
    textAlign: 'center',
  },
  heading: {
    fontSize: '2rem',
    color: '#196795',
    marginBottom: '10px',
  },
  subheading: {
    fontSize: '1.2rem',
    color: '#6c757d',
    marginBottom: '20px',
  },
  checklist: {
    listStyleType: 'none',
    padding: 0,
  },
  checklistItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'start',
    margin: '10px 0',
  },
  checkbox: {
    width: '20px',
    height: '20px',
    marginRight: '10px',
    accentColor: '#196795',
  },
  checkboxLabel: {
    fontSize: '1.1rem',
    color: '#343a40',
    transition: 'color 0.3s',
  },
  checkboxLabelChecked: {
    fontSize: '1.1rem',
    color: '#28a745', // Green color for completed items
    textDecoration: 'line-through',
  },
  ctaBtn: {
    backgroundColor: '#196795',
    color: 'white',
    fontSize: '1rem',
    padding: '12px 30px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '20px',
    transition: 'background-color 0.3s',
  },
  ctaBtnHover: {
    backgroundColor: '#155f73', // Darker shade on hover
  },
  ctaBtnActive: {
    backgroundColor: '#123e51', // Even darker shade on click
  },
  additionalPoints: {
    marginTop: '30px',
    textAlign: 'left',
  },
  additionalHeading: {
    fontSize: '1.5rem',
    color: '#196795',
    marginBottom: '10px',
  },
  tipList: {
    fontSize: '1.1rem',
    color: '#343a40',
    lineHeight: '1.8',
    paddingLeft: '20px',
    textAlign: 'left',
  },
};

export default InterviewCheck;
