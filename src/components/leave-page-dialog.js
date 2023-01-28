import React from "react";
import ReactRouterPrompt from 'react-router-prompt'

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

export const LeavePageDialog = ({ isModified }) => {

  return (
      <ReactRouterPrompt when={isModified} >
        {({ isActive, onConfirm, onCancel }) => (
          <Dialog open={isActive}>
            <DialogTitle>
              Are you sure you want to leave this page?
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                If you leave, the changes you made will be lost.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={onCancel}>No</Button>
              <Button onClick={onConfirm} autoFocus>
                Yes
              </Button>
            </DialogActions> 
          </Dialog>
        )}
      </ReactRouterPrompt>
    );
};
