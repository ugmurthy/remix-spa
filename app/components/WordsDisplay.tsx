const WordDisplay = ({ words }) => {
    //console.log("WordsDisplay ",words)
    if (!words || words.length === 0) {
       return <div></div>
     }
    return (
      <div>
        {words?.map((words, index) => (
          <span
            key={index}
            className={`mr-1 ${getWordClasses(words.confidence)}`}
          >
            {words.text}
          </span>
        ))}
      </div>
    );
  };

  const getWordClasses = (confidence) => {
    let classes = '';
  
    if (confidence >= 0.9) {
      classes += 'text-green-500 font-bold';
    } else if (confidence >= 0.7) {
      classes += 'text-blue-500';
    } else if (confidence >= 0.5) {
      classes += 'text-orange-500';
    } else {
      classes += 'text-red-500';
    }
  
    return classes;
  };

export default WordDisplay;