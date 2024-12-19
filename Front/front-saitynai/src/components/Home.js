import React from "react";
import { motion } from "framer-motion";

const Home = () => {
    return (
        <div
            style={{
                textAlign: "center",
                backgroundColor: "white",
                padding: "20px",
                minHeight: "80vh",
                overflow: "hidden", 
            }}
        >
         
            <motion.h1
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                style={{
                    color: "#333",
                    fontSize: "2rem",
                    margin: "10px 0",
                }}
            >
                Welcome to Gym Management App!
            </motion.h1>

            
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                style={{
                    fontSize: "1.2rem",
                    color: "#555",
                }}
            >
                Ready to achieve your fitness goals? Let's get started!
            </motion.p>

           
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                style={{
                    display: "inline-block",
                    margin: "20px",
                    position: "relative", 
                }}
            >
                <motion.div
                    animate={{
                        rotate: [0, 4, -15, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "loop",
                    }}
                    style={{
                        transformOrigin: "center", // Keeps animations centered
                    }}
                >
                    <img
                        src="/Images/dumbell1.png"
                        alt="Dumbbell"
                        style={{
                            display: "block",
                            margin: "0 auto",
                            maxWidth: "50%",
                            height: "auto",
                        }}
                    />
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Home;
