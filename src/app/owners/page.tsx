'use client'

import { OwnersDirectory } from '@/components/OwnersDirectory'
import { useCustomers } from '@/hooks/useData'
import { useStrataScheme } from '@/contexts/StrataSchemeContext'

export default function OwnersPage() {
  const { currentScheme } = useStrataScheme()
  const { data: customers = [] } = useCustomers(currentScheme?.id || null)

  return <OwnersDirectory customers={customers} />
}