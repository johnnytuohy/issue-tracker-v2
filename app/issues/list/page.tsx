import prisma from '@/prisma/client';
import { Issue, Status } from '@prisma/client';
import { Table } from '@radix-ui/themes';
import NextLink from 'next/link';
import { IssueStatusBadge, Link } from '@/app/components';
import IssueActions from './IssueActions';
import { ArrowUpIcon, ArrowDownIcon } from '@radix-ui/react-icons';

interface Props {
  searchParams: {
    status?: Status;
    orderBy?: keyof Issue;
    order?: 'asc' | 'desc';
  };
}

const IssuesPage = async ({ searchParams }: Props) => {
  // Define valid columns for sorting
  const columns: { label: string; value: keyof Issue; className?: string }[] = [
    { label: 'Issue', value: 'title' },
    { label: 'Status', value: 'status', className: 'hidden md:table-cell' },
    { label: 'Created', value: 'createdAt', className: 'hidden md:table-cell' },
  ];

  const validColumns = columns.map(column => column.value);
  const validOrders: ('asc' | 'desc')[] = ['asc', 'desc'];

  // Validate 'status' parameter
  const statuses = Object.values(Status);
  const status =
    searchParams.status && statuses.includes(searchParams.status)
      ? searchParams.status
      : undefined;

  // Validate 'orderBy' parameter, use undefined if invalid
  const orderBy = validColumns.includes(searchParams.orderBy as keyof Issue)
    ? searchParams.orderBy
    : undefined;

  // Validate 'order' parameter, use undefined if invalid
  const order = validOrders.includes(searchParams.order as 'asc' | 'desc')
    ? searchParams.order
    : undefined;

  // Default to 'createdAt' and 'asc' if no valid values are provided
  const finalOrderBy = orderBy || 'createdAt';
  const finalOrder = order || 'asc';

  // Prisma query with valid sorting parameters
  const issues = await prisma.issue.findMany({
    where: {
      status,
    },
    orderBy: {
      [finalOrderBy]: finalOrder,
    },
  });

  const toggleOrder = (currentOrder: 'asc' | 'desc') =>
    currentOrder === 'asc' ? 'desc' : 'asc';

  return (
    <div>
      <IssueActions />
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            {columns.map(column => (
              <Table.ColumnHeaderCell key={column.value}>
                <NextLink
                  href={{
                    query: {
                      ...searchParams,
                      orderBy: column.value,
                      order:
                        column.value === finalOrderBy
                          ? toggleOrder(finalOrder)
                          : 'asc', // Default to ascending if it's a new column sort
                    },
                  }}
                >
                  {column.label}
                </NextLink>
                {column.value === finalOrderBy && (
                  <>
                    {finalOrder === 'asc' ? (
                      <ArrowUpIcon className="inline" />
                    ) : (
                      <ArrowDownIcon className="inline" />
                    )}
                  </>
                )}
              </Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {issues.map(issue => (
            <Table.Row key={issue.id}>
              <Table.Cell>
                <Link href={`/issues/${issue.id}`}>{issue.title}</Link>
                <div className="block md:hidden">
                  <IssueStatusBadge status={issue.status} />
                </div>
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                <IssueStatusBadge status={issue.status} />
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                {issue.createdAt.toDateString()}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
};

export const dynamic = 'force-dynamic';

export default IssuesPage;
