import React from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import {Container, Icon, Placeholder, List} from "semantic-ui-react";

import {PatientDetails} from "../types";
import {apiBaseUrl} from "../constants";
import {useStateValue} from "../state";

const PatientPage: React.FC = () => {
    const {id} = useParams<{id: string}>();
    const [{patient}, dispatch] = useStateValue();

    console.log("patient", patient);

    React.useEffect(() => {
        if (patient?.id && patient?.id === id) {
            return;
        }
        const fetchPatient = async () => {
            console.log('fetching');
            try {
                const {data: patientFromApi} = await axios.get<PatientDetails>(
                    `${apiBaseUrl}/patients/${id}`
                );
                dispatch({type: "SET_PATIENT", payload: patientFromApi});
            } catch (e) {
                console.log(e);
            }
        };
        fetchPatient();
    }, [id, dispatch]);

    if (!patient) {
        return (
            <Placeholder>
                <Placeholder.Header image>
                    <Placeholder.Line />
                    <Placeholder.Line />
                </Placeholder.Header>
                <Placeholder.Paragraph>
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                </Placeholder.Paragraph>
            </Placeholder>
        );
    }

    return (
        <div className="App">
            <Container textAlign="left">
                <h3>
                    {patient.name}
                    {/* <Icon name={genderToIcon} /> */}
                    <Icon name={patient.gender === "male" ? "mars" : "venus"} />
                </h3>
                <p>Date of birth: {patient.dateOfBirth}</p>
            </Container>
            <Container>
                <p>occupation: {patient.occupation}</p>
                <Notes entries={patient.entries} />
            </Container>
        </div>
    );
};

const Notes: React.FC<{entries: string[] | undefined}> = ({entries}) => {
    return (
        <Container>
            <p>Notes:</p>
            <List>
                {entries?.map((e, index) => <List.Item key={index}>{e}</List.Item>)}
            </List>
        </Container>
    );
};

export default PatientPage;
