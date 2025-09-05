import React, {useEffect} from 'react';
import { ProjectPayloadDTO } from '../../../shared/types/sharedTypes';

interface ProjectViewerProps {
}

const ProjectViewer: React.FC<ProjectViewerProps> = ({}) => {
    const [projects, setProjects] = React.useState<any[]>([] as ProjectPayloadDTO[]);
    
    useEffect(() => {
        // Fetch projects from API
        
    }, []);

    return (
        <div>
            <h1>Projects</h1>
            <button>Create new Project</button>
            <p>No projects yet!</p>
        </div>
    );

};



export default ProjectViewer;