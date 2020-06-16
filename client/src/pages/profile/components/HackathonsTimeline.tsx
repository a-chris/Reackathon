import { Box, Flex, Text } from '@chakra-ui/core';
import * as _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import styled from 'styled-components';
import { Hackathon } from '../../../models/Models';
import colors, { getRandomColorHex } from '../../../utils/colors';
import { Link } from 'react-router-dom';

export default function HackathonsTimeline({ hackathons }: { hackathons: Hackathon[] }) {
    const hackathonCount = hackathons.length;
    const elementColors = React.useMemo(() => {
        return hackathons.map(() => getRandomColorHex());
        /*
         *   Used to keep the same colors after a re-render
         */
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hackathonCount]);

    return (
        <StyledBox w='100%' pb='20px'>
            <VerticalTimeline layout='2-columns' className='vertical-timeline-custom-line'>
                {hackathons.map((hack, index) => (
                    <VerticalTimelineElement
                        className='vertical-timeline-element'
                        contentStyle={{
                            background: elementColors[index],
                            color: colors.black_almost,
                            padding: '10px 30px',
                        }}
                        contentArrowStyle={{
                            borderRight: '7px solid ' + colors.black_almost,
                        }}
                        iconStyle={{
                            boxShadow: `0 0 0 4px ${colors.black}, inset 0 2px 0 rgba(0,0,0,.08), 0 3px 0 4px rgba(0,0,0,.05)`,
                            backgroundColor: elementColors[index],
                        }}
                        date={formatHackathonPeriod(hack)}
                        key={index}>
                        <Link to={`/hackathons/${hack._id}`}>
                            <Flex justify='space-between'>
                                <Box>
                                    <Text>{hack?.name}</Text>
                                    <Text>{hack?.description.substring(0, 50)}...</Text>
                                </Box>
                            </Flex>
                        </Link>
                    </VerticalTimelineElement>
                ))}
            </VerticalTimeline>
        </StyledBox>
    );
}

const StyledBox = styled(Box)`
    .vertical-timeline.vertical-timeline-custom-line::before {
        background: ${colors.black_almost};
    }
`;

function formatHackathonPeriod(hackathon: Hackathon) {
    const outputFormat = 'DD/MM/yyyy';
    const from = moment(hackathon?.startDate).locale('it').format(outputFormat);
    const to = moment(hackathon?.endDate).locale('it').format(outputFormat);
    return `${_.capitalize(from)} - ${_.capitalize(to)}`;
}
