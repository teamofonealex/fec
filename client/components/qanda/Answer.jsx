import React, { useState, useEffect } from 'react';

const Answer = (props) => {
  const { answer, updateAnswersHelpfulness, reportAnswer } = props;
  const { answerer_name, body, helpfulness, id, photos, date } = answer;
  let [helpfulCount, setHelpfulCount] = useState(helpfulness);
  const [isHelpful, setIsHelpful] = useState(false);

  const convertDate = (date) => {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const newDate = new Date(date).toLocaleDateString([], options);
    return newDate;
  };

  const updateHelpfulCount = () => {
    if (!isHelpful) {
      setIsHelpful(true);
      setHelpfulCount(helpfulCount += 1);
      updateAnswersHelpfulness(id);
    }
  }

  return(
  <div className="answer">
    {/* {console.log('this is the converted date for the answer', convertDate(answer.date))} */}
    <div>
      <strong>A:</strong> {body}
    </div>
    <div>
      <span className="answer-flavor-text">
        by {answerer_name}
        ,
        {convertDate(answer.date)}
      </span>
      <span className="answer-flavor-text">|</span>
      <span className="answer-flavor-text">
        Helpful?
      </span>
      <span
        className="answer-flavor-text underline"
        onClick={() => updateHelpfulCount()} role="button">
        Yes
      </span>
      <span className="answer-flavor-text">
        &#40;{helpfulCount}&#41;
      </span>
      <span className="answer-flavor-text">|</span>
      <span
        className="answer-flavor-text underline"
        onClick={() => reportAnswer(id)}>
        Report
      </span>
    </div>
    {photos.map((url, idx) => (
      <img src={url} key={id + idx} width="75" height="75" alt="" />
    ))}
    {/* <div onDoubleClick={() => reportAnswer(id)}>Report</div> */}
  </div>

  )
}

export default Answer;
// style="width: 100px;height:100px;"