import React, { useState, useContext } from 'react';
import { SignerContext } from '../contexts/SignerContext';
import { mintProfile } from '../../lib/lensApi';
import Button from './Button';

export default function CreateProfile({ ownerAddress }) {
  const signer = useContext(SignerContext);
  const [username, setUsername] = useState('');
  const [profileStatus, setProfileStatus] = useState('not-created');
  const handleCreateProfile = async (ownerAddress, username) => {
    setProfileStatus('creating');
    try {
      await mintProfile(ownerAddress, username, signer);
      setProfileStatus('created');
      setUsername(username);
    } catch (e) {
      console.error(e);
      setProfileStatus('error');
    }
  };

  if (profileStatus === 'creating') {
    return <div>Creating profile...</div>;
  } else if (profileStatus === 'not-created') {
    return (
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateProfile(ownerAddress, e.target.username.value);
          }}
        >
          <input
            type="text"
            name="username"
            id="username"
            className="p-2 border-blue-600 border-2 rounded-lg mx-2"
            placeholder="New username..."
          />
          <Button type="submit">Create a new lens profile</Button>
        </form>
      </div>
    );
  } else if (profileStatus === 'created') {
    return (
      <div>
        <h1>
          Your profile with handle {username} has been created! You can start
          submiting and approving post proposals!
        </h1>
      </div>
    );
  } else {
    return (
      <div>
        <h1>There was an error creating your profile.</h1>
      </div>
    );
  }
}
