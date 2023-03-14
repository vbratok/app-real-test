import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Avatar } from '@mui/material';
import { blue } from '@mui/material/colors';
import { AuthContext } from '../../App';
import { useContext } from 'react';
import ReactTimeAgo from 'react-time-ago';

type UserDialogProps = {
  open: boolean;
  onClose: () => void;
};

const UserDialog: React.FC<UserDialogProps> = ({ onClose, open }) => {
  const { user, login } = useContext(AuthContext);
  const handleClose = () => {
    onClose();
  };
  const handleLogout = () => {
    handleClose();
    login();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Account Details</DialogTitle>
      <List sx={{ pt: 0 }}>
        <ListItem disableGutters>
          <ListItemButton>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={user?.name} />
          </ListItemButton>
        </ListItem>
        <ListItem disableGutters>
          <ListItemButton>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                <EmailIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={user?.email} />
          </ListItemButton>
        </ListItem>
        <ListItem disableGutters>
          <ListItemButton>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                <AccessTimeIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText>
              You joined us:{' '}
              <ReactTimeAgo
                date={
                  user?.createdDate ? new Date(user?.createdDate) : new Date()
                }
              />
            </ListItemText>
          </ListItemButton>
        </ListItem>
        <ListItem disableGutters>
          <ListItemButton autoFocus onClick={() => handleLogout()}>
            <ListItemAvatar>
              <Avatar>
                <LogoutIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Dialog>
  );
};

export default UserDialog;
