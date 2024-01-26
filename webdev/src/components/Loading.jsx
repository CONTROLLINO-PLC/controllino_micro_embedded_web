import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

const CustomCircularProgress = styled(CircularProgress)({
 color: 'yellow',
 size: 50,
});

function LoadingComponent() {
 return <CustomCircularProgress />;
}

export default LoadingComponent;
