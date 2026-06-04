import { useEffect,useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";

const Project = () =>{
    const [project, setProject] = useState<any[]>([]);

    return(
        
        <Navbar />
    )
};

export default Project;