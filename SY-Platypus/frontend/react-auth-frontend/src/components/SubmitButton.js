import React from 'react';
import { Button } from '@mui/material';

const SubmitButton = ({ onClick }) => {
    return (
        <Button color="primary" variant="contained" onClick={onClick}>
            Submit
        </Button>
    );
};

export default SubmitButton;
