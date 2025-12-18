'use client';

import { Badge, Tooltip, Box } from '@chakra-ui/react';
import type { SLAStatus } from '@/lib/slaUtils';

interface SLAStatusBadgeProps {
  status: SLAStatus;
  showTime?: boolean;
}

export function SLAStatusBadge({ status, showTime = true }: SLAStatusBadgeProps) {
  const colorScheme = status.statusColor === 'gray' ? 'gray'
    : status.statusColor === 'green' ? 'green'
    : status.statusColor === 'yellow' ? 'yellow'
    : status.statusColor === 'orange' ? 'orange'
    : 'red';

  const tooltipContent = status.responseDeadline || status.resolutionDeadline ? (
    <>
      {status.responseDeadline && (
        <div>
          Response deadline: {status.responseDeadline.toLocaleString()}
          {status.responseTimeMet ? ' ✓' : ' ✗'}
        </div>
      )}
      {status.resolutionDeadline && (
        <div>
          Resolution deadline: {status.resolutionDeadline.toLocaleString()}
          {status.resolutionTimeMet ? ' ✓' : ' ✗'}
        </div>
      )}
    </>
  ) : 'No SLA defined for this task';

  return (
    <Tooltip label={tooltipContent} placement="top" hasArrow>
      <Badge
        colorScheme={colorScheme}
        variant="subtle"
        fontSize="2xs"
        px={2.5}
        py={1}
        borderRadius="md"
        fontWeight="semibold"
        display="inline-flex"
        alignItems="center"
        gap={1}
      >
        <Box as="span">
          {status.statusLabel}
        </Box>
        {showTime && status.remainingTimeFormatted !== 'N/A' && (
          <Box as="span" opacity={0.8} fontWeight="medium">
            · {status.remainingTimeFormatted}
          </Box>
        )}
      </Badge>
    </Tooltip>
  );
}
