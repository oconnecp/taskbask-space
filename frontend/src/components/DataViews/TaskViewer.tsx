import React, { useEffect } from 'react';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Modal from '../Modal/Modal';
import { ProjectPayloadDTO, TaskDTO, NewTaskDTO } from '../../../shared/types/sharedTypes';

import { postNewTask, updateTask } from '../../services/taskService';
import { getAllTasksForProject } from '../../services/projectService';
import { getAllUsers } from '../../services/userService';
import { getFullUrl } from '../../services/apiClientService';

import { ToastTypeEnum, ToastType, triggerToast } from '../Toast/ToastService';

interface TaskViewerrProps {
    selectedProjectPayloadDTO?: ProjectPayloadDTO | null;
}

const TaskViewer: React.FC<TaskViewerrProps> = ({ selectedProjectPayloadDTO }) => {
    const [tasksLoading, setTasksLoading] = React.useState<boolean>(true);
    const [taskArray, setTaskArray] = React.useState<any[]>([] as TaskDTO[]);
    const [selectedTaskId, setSelectedTaskId] = React.useState<string | null>(null);

    // Modal state
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    // Modal form state
    const [taskTitle, setTaskTitle] = React.useState('');
    const [taskDescription, setTaskDescription] = React.useState('');
    const [taskStatusId, setTaskStatusId] = React.useState<string | null>(null);
    const [taskDueDate, setTaskDueDate] = React.useState<Date | null>(new Date());
    const [taskPriority, setTaskPriority] = React.useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
    const [taskAssigneeId, setTaskAssigneeId] = React.useState<string | null>(null);

    const [allUserOptions, setAllUserOptions] = React.useState<{ value: string; profilePictureUrl: string; label: string }[]>([]);
    const [statusOptions, setStatusOptions] = React.useState<{ value: string; label: string }[]>([]);
    const [priorityOptions] = React.useState([
        { value: 'LOW', label: 'Low' },
        { value: 'MEDIUM', label: 'Medium' },
        { value: 'HIGH', label: 'High' },
        { value: 'URGENT', label: 'Urgent' },
    ]);

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        // Call your API to create project here
        const newTask: NewTaskDTO = {
            projectId: selectedProjectPayloadDTO!.project.id,
            assigneeId: null,
            statusId: taskStatusId!,
            title: taskTitle,
            description: taskDescription,
            dueDate: taskDueDate,
            priority: taskPriority,
        }

        const savedTask: TaskDTO | null = await postNewTask(newTask);
        setTaskArray([...taskArray, savedTask]);
        if (savedTask) {
            onTaskClick(savedTask.id);
        }

        // After success:
        setIsModalOpen(false);
        setTaskTitle('');
        setTaskDescription('');
        setTaskStatusId('');
        setTaskDueDate(null);
        setTaskPriority('MEDIUM');
    };

    const onTaskClick = (taskId: string) => {
        console.log(taskId)
        setSelectedTaskId(taskId);
    }

    useEffect(() => {
        getAllUsers().then(fetchedUserOptions => {
            if (fetchedUserOptions && fetchedUserOptions.length > 0) {
                const options = fetchedUserOptions.map(user => ({
                    value: user.id!,
                    profilePictureUrl: user.profilePictureUrl || '',
                    label: user.name || user.email || 'Unknown User',
                }));
                setAllUserOptions(options);
            }
        });

        if (!selectedProjectPayloadDTO) {
            setTasksLoading(false);
            setStatusOptions([]); // Clear options if no project
            return;
            //stop excution if no project selected
        }

        const options = selectedProjectPayloadDTO.statuses.map(status => ({
            value: status.id,
            label: status.name,
        }));
        setStatusOptions(options);
        setTaskStatusId(options[0]?.value);

        // Fetch projects from API
        getAllTasksForProject(selectedProjectPayloadDTO!.project.id).then(fetchedTaskDTOArray => {
            if (fetchedTaskDTOArray && fetchedTaskDTOArray.length > 0) {
                setTaskArray(fetchedTaskDTOArray);
                onTaskClick(fetchedTaskDTOArray[0].id);
            }
        }).catch(error => {
            console.error("Error fetching projects: ", error);
        }).finally(() => {
            setTasksLoading(false);
        });
    }, [selectedProjectPayloadDTO]);

    // Add this inside your TaskViewer component
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'LOW': return '#4caf50';      // green
            case 'MEDIUM': return '#ffeb3b';   // yellow
            case 'HIGH': return '#ff9800';     // orange
            case 'URGENT': return '#f44336';   // red
            default: return '#888';
        }
    };

    // Utility to find user profile picture URL from user ID
    // This is not optimized for production and will need to be changed
    // if the user list is large.
    // This needs to be a map or dictionary lookup in production
    const findUserPictureURLFromId = (userId: string): string => {
        const user = allUserOptions.find(user => user.value === userId);
        if (!user) return '';

        return user.profilePictureUrl ? getFullUrl(`/api/image/proxy-image?url=${encodeURIComponent(user.profilePictureUrl)}`) : '';
    }

    //Utility to find the user name from user ID
    // This is not optimized for production and will need to be changed
    // if the user list is large.
    // This needs to be a map or dictionary lookup in production
    const findUserNameFromId = (userId: string): string => {
        const user = allUserOptions.find(user => user.value === userId);
        return user ? user.label : 'Unknown User';
    }

    const setTaskStatus = (taskDTO: TaskDTO, newStatusId: string | null): void => {
        if (!newStatusId) {
            console.error("Status ID cannot be null");
            return;
        }
        taskDTO.statusId = newStatusId;
        //call api to update task
        updateTask(taskDTO).then(updatedTask => {
            if (updatedTask) {
                //update task in task array
                const updatedTaskArray = taskArray.map(task => {
                    if (task.id === updatedTask.id) {
                        return updatedTask;
                    }
                    return task;
                });
                setTaskArray(updatedTaskArray);
                console.log("Task updated successfully");
                triggerToast({ message: 'Task updated successfully', duration: 3000, type: ToastTypeEnum.SUCCESS });
            }else {
                console.error("Failed to update task");
            }
        });
    };

    if (tasksLoading) {
        return <div>Loading projects...</div>;
    }

    if (!selectedProjectPayloadDTO) {
        return <div>Please select a project to view tasks.</div>;
    }

    const taskListStyle: React.CSSProperties = {
        backgroundColor: '#383838',
    };

    const selectedTaskStyle: React.CSSProperties = {
        ...taskListStyle,
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

                <h2 style={{ margin: 0 }}>Tasks</h2>
                <div style={{ flex: 1 }} />

                {/* click is disabled if no project is selected */}
                <button onClick={() => selectedProjectPayloadDTO && setIsModalOpen(true)}>Create new Task</button>
            </div>
            <br />
            <br />
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2>Create Task</h2>

                <br />
                <form onSubmit={handleCreateTask}>
                    <div>
                        <label>Name:</label>                        <br />

                        <input style={inputStyle} value={taskTitle} onChange={e => setTaskTitle(e.target.value)} required />
                    </div>
                    <br />

                    <div>
                        <label>Description:</label>
                        <br />
                        <textarea rows={3} style={inputStyle} value={taskDescription} onChange={e => setTaskDescription(e.target.value)} />
                    </div>
                    <br />
                    <div>
                        <label>Status:</label>
                        <Select
                            options={statusOptions}
                            value={statusOptions.find(option => option.value === taskStatusId) || null}
                            onChange={(selectedOption) => {
                                // selectedOption can be null
                                setTaskStatusId(selectedOption ? selectedOption.value : null);
                            }}
                            theme={theme => ({
                                ...theme,
                                colors: {
                                    ...theme.colors,
                                    primary25: '#333',   // option hover
                                    primary: '#555',     // selected option
                                    neutral0: '#222',    // menu background
                                    neutral80: '#fff',   // text color
                                    neutral20: '#555',   // border color
                                    neutral30: '#888',   // border hover
                                },
                            })}
                        />
                    </div>
                    <br />
                    <div>
                        <label>Due Date:</label>
                        <br />

                        <DatePicker
                            selected={taskDueDate}
                            onChange={(date: Date | null) => setTaskDueDate(date)}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Select a due date"
                            customInput={
                                <input style={inputStyle} />
                            }
                        />
                    </div>
                    <br />
                    <div>
                        <label>Priority:</label>
                        <Select
                            options={priorityOptions}
                            value={priorityOptions.find(option => option.value === taskPriority) || null}
                            onChange={(selectedOption) => {
                                // selectedOption can be null
                                setTaskPriority(selectedOption ? selectedOption.value as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' : 'MEDIUM');
                            }}
                            theme={theme => ({
                                ...theme,
                                colors: {
                                    ...theme.colors,
                                    primary25: '#333',   // option hover
                                    primary: '#555',     // selected option
                                    neutral0: '#222',    // menu background
                                    neutral80: '#fff',   // text color
                                    neutral20: '#555',   // border color
                                    neutral30: '#888',   // border hover
                                },
                            })}
                        />
                    </div>
                    <div>
                        <label>Assignee:</label>
                        <Select
                            options={allUserOptions}
                            value={allUserOptions.find(option => option.value === taskAssigneeId) || null}
                            onChange={selectedOption => setTaskAssigneeId(selectedOption ? selectedOption.value : null)}
                            isClearable
                            placeholder="Assign to..."
                            theme={theme => ({
                                ...theme,
                                colors: {
                                    ...theme.colors,
                                    primary25: '#333',   // option hover
                                    primary: '#555',     // selected option
                                    neutral0: '#222',    // menu background
                                    neutral80: '#fff',   // text color
                                    neutral20: '#555',   // border color
                                    neutral30: '#888',   // border hover
                                },
                            })}
                        />
                    </div>
                    <br />
                    <button type="submit">Create</button>
                </form>
            </Modal>

            {taskArray.length === 0 ? (
                <p>No Tasks found.</p>
            ) : (
                <>
                    {taskArray.map(taskDTO => (
                        <div
                            style={selectedTaskId === taskDTO.id ? selectedTaskStyle : taskListStyle}
                            onClick={() => onTaskClick(taskDTO.id)}
                            key={taskDTO.id}
                        >
                            <span
                                style={{
                                    display: 'inline-block',
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    background: getPriorityColor(taskDTO.priority),
                                    marginRight: 8,
                                    verticalAlign: 'middle'
                                }}
                            />
                            {taskDTO.assigneeId && (
                                <img
                                    src={findUserPictureURLFromId(taskDTO.assigneeId)}
                                    alt={`Assigned to ${findUserNameFromId(taskDTO.assigneeId)}`}
                                    style={{
                                        width: 24,
                                        height: 24,
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        marginRight: 8,
                                        verticalAlign: 'middle',
                                        border: '1px solid #555'
                                    }}
                                />
                            )}
                            <span>{taskDTO.title}</span> - <span>{taskDTO.description}</span>
                            <span><Select
                                options={statusOptions}
                                value={statusOptions.find(option => option.value === taskDTO.statusId) || null}
                                onChange={(selectedOption) => {
                                    // selectedOption can be null
                                    setTaskStatus(taskDTO, selectedOption ? selectedOption.value : null);
                                }}
                                theme={theme => ({
                                    ...theme,
                                    colors: {
                                        ...theme.colors,
                                        primary25: '#333',   // option hover
                                        primary: '#555',     // selected option
                                        neutral0: '#222',    // menu background
                                        neutral80: '#fff',   // text color
                                        neutral20: '#555',   // border color
                                        neutral30: '#888',   // border hover
                                    },
                                })}
                            /></span>
                        </div>
                    ))}
                </>
            )}
        </div>
    );

};



export default TaskViewer;