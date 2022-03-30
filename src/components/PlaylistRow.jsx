import styled from "styled-components";

const Tr = styled.tr`
    padding: 10px 5px;
    &:nth-child(2n) {
        background-color: rgba(211, 211, 211, 0.2);
    }
`;

const Td = styled.td`
    padding: 10px;
`

export function PlaylistRow({playlist, onSelect, checked}) {
    const isChecked = checked === undefined ? false: checked;

    const getTitle = () => {
        if (playlist.title.length > 30) {
            return `${playlist.title.substring(0, 15)}...`;
        }
        return playlist.title;
    }

    return (
        <Tr>
            <Td>
                <input type="checkbox" name="playlistSelected" onChange={(e) => onSelect(e, playlist)} checked={isChecked}/>
            </Td>
            <Td>{getTitle()}</Td>
            <Td>{playlist.nb_tracks}</Td>
        </Tr>
    );
}