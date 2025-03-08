import React from "react";
import Lottie from "react-lottie"; // Import the react-lottie library
import animationData from "../../public/greenrobot.json"; // Import your lottie animation JSON file

const LottieBot: React.FC = () => {
    // Define the options for the Lottie animation
    const defaultOptions = {
        loop: true, // Set the animation to loop
        autoplay: true, // Set the animation to autoplay
        animationData, // Your Lottie JSON data
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice", // Adjust rendering as per your need
        },
    };

    return (
        <Lottie options={defaultOptions} height={400} width={400} />
    );
};

export default LottieBot;