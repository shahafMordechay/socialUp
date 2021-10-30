import { makeStyles } from '@material-ui/core';

const SkeletonStyle = makeStyles((theme) => ({
  card: {
    display: 'flex',
    marginBottom: 20
  },
  cardContent: {
    width: '100%',
    flexDirection: 'column',
    padding: 25
  },
  cover: {
    minWidth: 200,
    objectFit: 'cover'
  },
  handle: {
    width: 60,
    height: 18,
    backgroundColor: theme.palette.primary.main,
    marginBottom: 7
  },
  date: {
    width: 100,
    height: 14,
    backgroundColor: 'rgba(0,0,0,0.3)',
    marginBottom: 10
  },
  fullLine: {
    width: '90%',
    height: 15,
    backgroundColor: 'rgba(0,0,0,0.6)',
    marginBottom: 10
  },
  halfLine: {
    width: '50%',
    height: 15,
    backgroundColor: 'rgba(0,0,0,0.6)',
    marginBottom: 10
  }
}));

export default SkeletonStyle;
