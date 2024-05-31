// components/TableRow.js
const TableRow = ({ flag, description }) => {
    const isDeprecated = description.includes('DEPRECATED');
    return (
      <tr className={isDeprecated ? 'deprecated-row' : ''}>
        <td>{flag}</td>
        <td>
          {isDeprecated ? <span className="deprecated"><strong>DEPRECATED</strong></span> : null}
          {description.replace('DEPRECATED', '')}
        </td>
      </tr>
    );
  };
  
  export default TableRow;
  