type Props = {
  tableText: string;
};

const TableComponent = ({ tableText }: Props) => {
  // Split the tableText into lines based on newlines
  const lines: string[] = tableText.split('\n');

  // Initialize an array to store the table data
  const tableData: string[][] = [];

  let explanatoryTextBefore: string[] = [];
  let explanatoryTextAfter: string[] = [];
  let isTableStarted = false;

  lines.forEach((line) => {
    if (line.includes('|')) {
      const cells: string[] = line.split('|').map((cell) => cell.trim());

      const filteredCells: string[] = cells.filter(
        (cell) => !/^-+$/.test(cell) && cell !== ''
      );

      if (filteredCells.length > 0) {
        tableData.push(filteredCells);
        isTableStarted = true;
      }
    } else if (!isTableStarted) {
      explanatoryTextBefore.push(line.trim());
    } else {
      explanatoryTextBefore.push(line.trim());
    }
  });

  const explanatoryTextBeforeString: string = explanatoryTextBefore.join('\n');
  const explanatoryTextAfterString: string = explanatoryTextAfter.join('\n');

  return (
    <div>
      {explanatoryTextBeforeString && <p>{explanatoryTextBeforeString}</p>}
      <table className='table-auto border-collapse w-full'>
        <thead>
          <tr>
            {tableData[0].map((header, index) => (
              <th key={index} className='border px-4 py-2'>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.slice(1).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className='border px-4 py-2'>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {explanatoryTextAfterString && <p>{explanatoryTextAfterString}</p>}
    </div>
  );
};

export default TableComponent;
