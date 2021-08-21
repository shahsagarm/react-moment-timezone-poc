import { useEffect, useRef, useState } from 'react';
import momentTimezone from 'moment-timezone';
import { annotate } from 'rough-notation';
import { makeStyles } from '@material-ui/core/styles';

// @Important :: if your bundler supports tree shaking (webpack >= 2.x, parcel with a flag), 
// use named imports otherwise use default imports
// Reference :: https://material-ui.com/guides/minimizing-bundle-size/
import {
    Container,
    Grid,
    Card,
    CardContent,
    CardActions,
    Typography,
    CssBaseline,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button
} from '@material-ui/core';

import { TIMEZONES } from './Constants/TimezonesConstant';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
    },
    heroContent: {
        padding: theme.spacing(4),
    },
    alignCenter: {
        textAlign: 'center'
    },
    flexAlignCenter: {
        display: 'flex',
        justifyContent: 'center'
    },
    formControl: {
        minWidth: '33%',
        color: '#fff',
    },
    redFont: {
        color: 'red'
    },
    blueFont: {
        color: 'blue'
    }
}));

const App = () => {
    const [selectedTimezone, setSelectedTimezone] = useState('Pacific/Auckland');
    const [dateTimeAsPerSelectedTimezone, setDateTimeAsPerSelectedTimezone] = useState('');
    const [currentDateTS, setCurrentDateTS] = useState(Date.now());
    const classes = useStyles();
    const datetimeElementRef = useRef(null);

    const onTimezoneChange = e => {
        const { value } = e.target;
        setSelectedTimezone(value);
    };

    useEffect(() => {
        // This function converts the given date as per the selected timezone using moment-timezone.js library
        const getDateTimeAsPerSelectedTimezone = (timestamp, timezone) => {
            const formattedDT = momentTimezone.tz(timestamp, timezone).format('M/D/YYYY hh:mm:ss A');
            return formattedDT;
        };

        if (selectedTimezone) {
            const dt = getDateTimeAsPerSelectedTimezone(currentDateTS, selectedTimezone);
            setDateTimeAsPerSelectedTimezone(dt);
        }
    }, [currentDateTS, selectedTimezone]);

    // just a design experiment
    useEffect(() => {
        let annotation;
        if (datetimeElementRef && datetimeElementRef.current) {
            const annotationTypes = ['underline', 'box', 'circle', 'highlight'];
            // get random annotation type from possible list of types
            const randomAnnotationType = annotationTypes[Math.floor(Math.random() * annotationTypes.length)]
            annotation = annotate(datetimeElementRef.current, { type: randomAnnotationType, color: '#FFD54F' });
            annotation.show();
        }

        return () => {
            // clear previous annotation 
            if (annotation) {
                annotation.remove();
            }
        }
    }, [dateTimeAsPerSelectedTimezone]);

    return (
        <>
            <CssBaseline />
            <main className={classes.root}>
                <div>
                    <div className={classes.heroContent}>
                        <Container maxWidth="md">
                            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                                React + Moment.js Timezone POC
                            </Typography>
                            <Typography variant="h6" align="center" color="textPrimary" paragraph>
                                This POC demonstrates the usage of "moment.js + moment-timezone.js" library along with react.
                            </Typography>
                            <ul>
                                <li>When any dates in your application must be shown according to the user's specified timezones rather than the user's system timezone.</li>
                                <li>Assume your user is from "Brisbane, Australia," and his or her system's default timezone is "(UTC + 10:00) Brisbane." Let's pretend he or she uses your app, but for whatever reason, he or she wishes to view any dates presented in your app in the "(UTC + 12:00) Auckland, Wellington" timezone.</li>
                                <li>In this scenario, you may use this poc to learn how to display dates based on the user's timezone selection.</li>
                            </ul>
                        </Container>
                    </div>
                    <Container maxWidth="md">
                        <Grid container spacing={8}>
                            <Grid item xs={12} sm={12} md={12} className={classes.flexAlignCenter}>
                                <FormControl className={classes.formControl}>
                                    <InputLabel id="timezone">Timezone</InputLabel>
                                    <Select
                                        labelId="timezone"
                                        name="selectedTimezone"
                                        value={selectedTimezone}
                                        onChange={onTimezoneChange}
                                    >
                                        <MenuItem value="" disabled>Select Timezone</MenuItem>
                                        {TIMEZONES.map(t => (
                                            <MenuItem value={t.value} key={t.value}>{t.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={12} md={6}>
                                <Card>
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="h4" className={classes.alignCenter}>
                                            Current time as per
                                            <strong className={classes.redFont}>&nbsp;System's&nbsp;</strong>
                                            timezone
                                        </Typography>
                                        <Typography className={classes.alignCenter}>
                                            Current Time : {new Date(currentDateTS).toLocaleString('en-US')}
                                        </Typography>

                                        <ul>
                                            <li>This time is displayed based on your system's timezone.</li>
                                            <li>If you change your system's timezone, this time <strong>WILL</strong> change.</li>
                                            <li>If you change timezone from dropdown, this time <strong>WILL NOT</strong> change.</li>
                                        </ul>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            size="small"
                                            color="primary"
                                            onClick={() => setCurrentDateTS(Date.now())}
                                        >
                                            Click this button to see updated date value after changing your system's timezone
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={12} md={6}>
                                <Card>
                                    <CardContent>
                                        {selectedTimezone && dateTimeAsPerSelectedTimezone ? (
                                            <>
                                                <Typography gutterBottom variant="h6" component="h4" className={classes.alignCenter}>
                                                    Current time as per
                                                    <strong className={classes.blueFont}>&nbsp;Selected&nbsp;</strong>
                                                    timezone
                                                </Typography>
                                                <Typography className={classes.alignCenter} ref={datetimeElementRef}>
                                                    Current Time : {dateTimeAsPerSelectedTimezone}
                                                </Typography>

                                                <ul>
                                                    <li>This time is displayed based on your selected timezone from the dropdown.</li>
                                                    <li>If you change timezone from dropdown, this time <strong>WILL</strong> change.</li>
                                                    <li>If you change your system's timezone, this time <strong>WILL NOT</strong> change.</li>
                                                </ul>
                                            </>
                                        ) : (
                                                <Typography gutterBottom variant="h6" component="h4" className={classes.alignCenter}>
                                                    To view the difference, please choose any timezone first.
                                                </Typography>
                                            )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Container>
                </div>
            </main>
        </>
    );
};

export default App;
