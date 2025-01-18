import React, { useState } from "react";
import VmMenu from "./vmmenu";

const Navbar = () => {
    const [activeSection, setActiveSection] = useState("Portfolio");


    // Sections array
    const sections = [
        "Portfolio",
        "NFT",
        "Transaction", // Note: Fixed typo from "Transcation" to "Transaction"
        "Fusion"
    ];

    const renderSectionContent = () => {
        switch (activeSection) {
            case "Portfolio":
                return (
                    <div>
                        <VmMenu />
                    
                    </div>

                );
            case "NFT":
                return (
                    <div>
                     
                    <h1> NFT</h1>
                    </div>

                );
                 case "Transaction":
                    return (
                        <div>
                            <h1> transaction</h1>
                
                        </div>
    
                    );
            case "Fusion":
                return (
                    <div>
                        <h1> fusion</h1>
                      
                    </div>

                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-[#482871]/40 mt-2  rounded-md">
            {/* Section Bar Menu */}
            <div className="flex justify-between px-1 py-2 relative">
                {sections.map((section, index) => (
                    <button
                        key={section}
                        className={`
                            text-sm font-medium px-3 py-2 rounded-md transition-all duration-300 relative
                            flex-1  // Ensure buttons equally size and fill the container
                            ${activeSection === section
                                ? 'bg-transparent text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-white'
                                : 'text-white/40 bg-transparent hover:text-gray-200'}
                            before:absolute before:bottom-0 before:left-0 before:w-full before:h-[1px] before:bg-white/10
                            hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-[2px] hover:after:bg-gray-500
                            ${index < sections.length - 1 ? '' : 'border-r-0'}  // Remove right border for all but the last button
                        `}
                        onClick={() => setActiveSection(section)}
                        aria-label={`Navigate to ${section} section`}
                    >
                        {section}
                    </button>
                ))}
            </div>

            {/* Section Content */}
            <div className="px-4 mt-2 flex-grow overflow-y-auto ">  {/* Add max height and make scrollable */}
                <div className="mb-6">
                    {/* Dynamic Section Content */}
                    <div className="mt-2">




                        {renderSectionContent()}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;