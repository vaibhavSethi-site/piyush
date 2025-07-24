// CapsPage.js

import React from 'react';
import { useParams } from 'react-router-dom';

const Cap = ({ pipeSizes }) => {
    console.log("Cap page")

    const { rollerSize, pipeSize, category, rollerName, capName } = useParams();

  const rollerSizeData = pipeSizes.find((size) => size.rollerSize === rollerSize);

  if (!rollerSizeData) {
    return <div>Invalid Roller Size</div>;
  }

  const pipeSizeData = rollerSizeData.pipeSizes.find((size) => size.size === pipeSize);

  if (!pipeSizeData) {
    return <div>Invalid Pipe Size</div>;
  }

  const categoryData = pipeSizeData.categories.find((cat) => cat.category === category);

  if (!categoryData) {
    return <div>Invalid Category</div>;
  }

  const rollerData = categoryData.rollers.find((roller) => roller.name === rollerName);

  if (!rollerData) {
    return <div>Invalid Roller</div>;
  }

  // Find the cap data
  const capData = rollerData.cap.find((cap) => cap.capName === capName);

  if (!capData) {
    return <div>Invalid Cap</div>;
  }

  return (
    <div>
      <h1>Cap Details for {capName}</h1>
      <p>Cap Name: {capData.capName}</p>
      {/* Display other cap details as needed */}
    </div>
  );
};

export default Cap;
