import React from 'react';

interface ProjectViewerProps {
}

const ProjectViewer: React.FC<ProjectViewerProps> = ({}) => {
    return (
        <div>
            <h1>Projects</h1>
            <button>Create new Project</button>
            <p>No projects yet!</p>
        </div>
    );

};



export default ProjectViewer;