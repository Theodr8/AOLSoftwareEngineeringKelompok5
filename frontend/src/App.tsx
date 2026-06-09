import React from 'react'; 
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Dashboard from './pages/Dashboard.tsx';
import Profile from './pages/Profile.tsx';
// import Chat from './pages/Chat.tsx';
import Project from './pages/Project.tsx';
import UserDetail from './component/UserDetail.tsx';
import PostDetail from './pages/PostDetail.tsx';
import ProjectDetail from './pages/ProjectDetail.tsx';
import FollowersList from './pages/FollowList.tsx';
import FollowingList from './pages/FollowingList.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Supaya kalau buka localhost:3000 langsung dilempar ke login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile/" element={<Profile />} />
        {/* <Route path="/chat" element={<Chat />} /> */}
        <Route path="/project" element= {<Project />} />





        {/* <Route path="/profile/" */}
        <Route path="/user/:userId" element= {<UserDetail />}/>
        <Route path="/post/:postId" element={<PostDetail />}/>
        <Route path="/project/:projectId" element={<ProjectDetail />}/>
        <Route path="/followerlist/:userId" element={<FollowersList />} />
        <Route path="/followinglist/:userId" element={<FollowingList />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;