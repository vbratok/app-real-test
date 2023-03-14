import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Avatar } from '@mui/material';
import UserDialog from './UserDialog';
import { AuthContext } from '../../App';

const stringAvatar = (name: string = '') => {
  let initials;
  let nameParts = name.split(' ');
  if (nameParts.length === 1 && !nameParts[0]) return;
  if (nameParts.length > 1) {
    initials = `${nameParts[0][0]}${nameParts[1][0]}`.toLocaleUpperCase();
  } else if (nameParts.length === 1) {
    initials = `${nameParts[0][0]}`.toLocaleUpperCase();
  }
  return initials
    ? {
        children: initials,
        alt: name,
      }
    : {};
};

const Header: React.FC = () => {
  const { user } = React.useContext(AuthContext);
  const [openUser, setOpenUser] = React.useState(false);
  const handleOpenUser = () => setOpenUser(true);
  const handleCloseUser = () => setOpenUser(false);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { sm: 'block' } }}
          >
            Todo Test Task
          </Typography>
          {user && (
            <>
              <Avatar
                onClick={handleOpenUser}
                sx={{ m: 1, bgcolor: 'secondary.main' }}
                {...stringAvatar(user?.name ?? '')}
              ></Avatar>
              <div>
                <UserDialog open={openUser} onClose={handleCloseUser} />
              </div>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
