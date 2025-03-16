import React from "react";
import animationData from "../../../public/greenrobot.json";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("react-lottie"), { ssr: false });

const LottieBot: React.FC = () => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    return (
        <Lottie options={defaultOptions} height={400} width={400} />
    );
};

export default LottieBot;