import React, { useEffect } from 'react';

import Modal from '../Modal/Modal';

import { getAllProjectsForUser, postNewProject } from '../../services/projectService';
import { NewProjectDTO, ProjectPayloadDTO } from '../../../shared/types/sharedTypes';

interface ProjectViewerProps {
    onProjectSelect: (projectPayload: ProjectPayloadDTO | null) => void;
    selectedProjectId: string | null;
}

const ProjectViewer: React.FC<ProjectViewerProps> = ({ onProjectSelect, selectedProjectId }) => {
    const [projectLoading, setProjectLoading] = React.useState<boolean>(true);
    const [projectPayloadArray, setProjectPayloadArray] = React.useState<any[]>([] as ProjectPayloadDTO[]);
    // const [selectedProjectId, setSelectedProjectId] = React.useState<string | null>(null);

    // Modal state
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    // Modal form state
    const [projectName, setProjectName] = React.useState('');
    const [projectDesc, setProjectDesc] = React.useState('');

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        // Call your API to create project here
        const newProject: NewProjectDTO = {
            name: projectName,
            description: projectDesc,
        }

        const thisPayload = await postNewProject(newProject);
        setProjectPayloadArray([...projectPayloadArray, thisPayload]);
        if (thisPayload) {
            onProjectClick(thisPayload);
        }

        // After success:
        setIsModalOpen(false);
        setProjectName('');
        setProjectDesc('');
    };

    const onProjectClick = (projectPayload: ProjectPayloadDTO) => {
        onProjectSelect(projectPayload);
    }

    useEffect(() => {
        // Fetch projects from API
        getAllProjectsForUser().then(fetchedProjectPayloads => {
            if (fetchedProjectPayloads && fetchedProjectPayloads.length > 0) {
                setProjectPayloadArray(fetchedProjectPayloads);
                onProjectClick(fetchedProjectPayloads[0]);

            }
        }).catch(error => {
            console.error("Error fetching projects: ", error);
        }).finally(() => {
            setProjectLoading(false);
        });
    }, []);

    if (projectLoading) {
        return <div>Loading projects...</div>;
    }

    const projectListStyle: React.CSSProperties = {
        backgroundColor: '#383838',
    };

    const selectedProjectStyle: React.CSSProperties = {
        ...projectListStyle,
        backgroundColor: '#1976d2',
        fontWeight: 'bold',
    };
    const inputStyle: React.CSSProperties = {
        backgroundColor: '#222',
        color: '#fff',
        border: '1px solid #555',
        borderRadius: 4,
        padding: '8px 12px',
        width: '300px',
        font: 'inherit',
        outline: 'none',
    };

    const projectStyle: React.CSSProperties = {
        width: '100%',
        height: 'auto',
        margin: '10px',
        boxSizing: 'border-box',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        cursor: 'pointer',
    };

    return (
        <div style={projectStyle}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ margin: 0 }}>Projects</h2>
                <div style={{ flex: 1 }} />
                <button onClick={() => setIsModalOpen(true)}>Create new Project</button>
            </div>
            <br />
            <br />
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2>Create Project</h2>
                <br />
                <form onSubmit={handleCreateProject}>
                    <div>
                        <label>Name:</label>
                        <br />
                        <input style={inputStyle} value={projectName} onChange={e => setProjectName(e.target.value)} required />
                    </div>
                    <br />
                    <div>
                        <label>Description:</label>
                        <br />
                        <textarea rows={3} style={inputStyle} value={projectDesc} onChange={e => setProjectDesc(e.target.value)} />
                    </div>
                    <br />
                    <button type="submit">Create</button>
                </form>
            </Modal>

            {projectPayloadArray.length === 0 ? (
                <p>No projects found.</p>
            ) : (
                <>
                    {projectPayloadArray.map(projectPayload => (
                        <div
                            style={selectedProjectId === projectPayload.project.id ? selectedProjectStyle : projectListStyle}
                            onClick={() => onProjectClick(projectPayload)}
                            key={projectPayload.project.id}
                        >
                            <span>{projectPayload.project.name}</span> - <span>{projectPayload.project.description}</span>
                        </div>
                    ))}
                </>
            )}
        </div>
    );

};



export default ProjectViewer;