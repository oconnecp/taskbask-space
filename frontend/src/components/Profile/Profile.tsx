import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { getFullUrl } from '../../services/ApiClient';
import { UserDTO } from '../../../shared/types/SharedTypes';

interface ProfileProps {
    user?: UserDTO | null;
}

const Profile: React.FC<ProfileProps> = ({user}) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (user === null || user === undefined) {
            navigate('/login');
        }
    }, [user, navigate]);

    if (!user) {
        return null;
    }

    const userProfilePictureUrl = user.profilePictureUrl? getFullUrl(`/api/images/proxy-image?url=${encodeURIComponent(user.profilePictureUrl)}`) : undefined;

    return (
        <div>
            <h1>Profile</h1>
            <img 
            width="100px" 
            height="100px" 
            src={userProfilePictureUrl}
            alt="User Avatar" 
            ></img>
            <p>Welcome, {user.name}!</p>
            <p>Your email: {user.email}</p>
        </div>
    );

};



export default Profile;