import React from 'react';
import { useParams } from 'react-router-dom';
import { Hackathon } from '../../models/Models';
import { getHackathon } from '../../services/HackathonService';

type RouteParams = {
    id: string;
};

export default function HackathonDetail({ id }: RouteParams) {
    const [hackathonData, setHackathonData] = React.useState<Hackathon>();
    const params = useParams<RouteParams>();
    const idHackathon = params.id.replace('id=', '');

    React.useEffect(() => {
        getHackathon(idHackathon).then((hackathon) => setHackathonData(hackathon));
    }, []);

    React.useEffect(() => {
        console.log(hackathonData);
    }, [hackathonData]);

    return <div>{hackathonData?.name}</div>;
}
