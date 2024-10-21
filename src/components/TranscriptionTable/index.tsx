import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from '@nextui-org/react';
import { Transcription } from '@/types';

type Props = {
  transcriptions: Transcription[];
};

const columns = [
  {
    key: 'text',
    label: 'Transcript',
  },
  {
    key: 'transcriptTime',
    label: 'Deepgram Time',
  },
  {
    key: 'botTime',
    label: 'GPT Time',
  },
  {
    key: 'botAnswer',
    label: 'Break Info',
  },
];

export default function TranscriptionTable({ transcriptions }: Props) {
  return (
    <Table aria-label="Example table with dynamic content" className="h-[600px]" isHeaderSticky>
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={transcriptions} emptyContent={"Please click on the “Start Recording” button"} >
        {(item) => (
          <TableRow key={item.key}>{(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}</TableRow>
        )}
      </TableBody>
    </Table>
  );
}
