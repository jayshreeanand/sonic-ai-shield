import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Flex,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Link,
  Skeleton,
  SkeletonText,
  useToast,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiSearch, FiPlus, FiFilter } from 'react-icons/fi';
import axios from 'axios';

// Helper functions
import { formatAddress, formatDate, getRiskBadgeProps } from '../utils/formatters';

const WalletDrainers = () => {
  const [drainers, setDrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const toast = useToast();

  useEffect(() => {
    const fetchDrainers = async () => {
      try {
        const response = await axios.get('/api/walletdrainer');
        setDrainers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching wallet drainers:', error);
        toast({
          title: 'Error fetching data',
          description: 'Could not load wallet drainers. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        
        // Mock data for demonstration
        setDrainers([
          {
            address: '0x1234567890abcdef1234567890abcdef12345678',
            name: 'Fake ETN Airdrop',
            riskLevel: 'high',
            victims: 12,
            totalStolen: 45000,
            lastActive: '2023-03-05T12:30:45Z',
            isVerified: true,
          },
          {
            address: '0xabcdef1234567890abcdef1234567890abcdef12',
            name: 'ETN Staking Scam',
            riskLevel: 'critical',
            victims: 28,
            totalStolen: 120000,
            lastActive: '2023-03-04T18:15:22Z',
            isVerified: true,
          },
          {
            address: '0x7890abcdef1234567890abcdef1234567890abcd',
            name: 'Fake DEX Frontend',
            riskLevel: 'medium',
            victims: 5,
            totalStolen: 18000,
            lastActive: '2023-03-03T09:45:11Z',
            isVerified: false,
          },
          {
            address: '0x567890abcdef1234567890abcdef1234567890ab',
            name: 'ETN Token Bridge Scam',
            riskLevel: 'high',
            victims: 9,
            totalStolen: 67000,
            lastActive: '2023-03-02T14:22:33Z',
            isVerified: true,
          },
          {
            address: '0x90abcdef1234567890abcdef1234567890abcdef',
            name: 'Fake Wallet App',
            riskLevel: 'low',
            victims: 2,
            totalStolen: 5000,
            lastActive: '2023-03-01T08:11:05Z',
            isVerified: false,
          },
        ]);
        setLoading(false);
      }
    };

    fetchDrainers();
  }, [toast]);

  // Filter drainers based on search term and risk filter
  const filteredDrainers = drainers.filter((drainer) => {
    const matchesSearch = 
      drainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drainer.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRisk = riskFilter === 'all' || drainer.riskLevel === riskFilter;
    
    return matchesSearch && matchesRisk;
  });

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" size="xl" color="white">
          Wallet Drainers
        </Heading>
        <Button
          as={RouterLink}
          to="/analyze"
          colorScheme="electroneum"
          leftIcon={<FiPlus />}
        >
          Analyze New Contract
        </Button>
      </Flex>

      <Flex 
        direction={{ base: 'column', md: 'row' }} 
        mb={6} 
        gap={4}
        align={{ base: 'stretch', md: 'center' }}
      >
        <InputGroup maxW={{ base: '100%', md: '400px' }}>
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Search by name or address"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            bg="gray.800"
            border="1px solid"
            borderColor="gray.700"
            _hover={{ borderColor: 'gray.600' }}
            _focus={{ borderColor: 'electroneum.500', boxShadow: '0 0 0 1px var(--chakra-colors-electroneum-500)' }}
          />
        </InputGroup>

        <HStack spacing={4}>
          <Flex align="center">
            <FiFilter color="gray.400" style={{ marginRight: '8px' }} />
            <Select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              bg="gray.800"
              border="1px solid"
              borderColor="gray.700"
              _hover={{ borderColor: 'gray.600' }}
              _focus={{ borderColor: 'electroneum.500' }}
              w={{ base: '100%', md: '150px' }}
            >
              <option value="all">All Risks</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </Select>
          </Flex>
        </HStack>
      </Flex>

      <Box
        bg="gray.800"
        borderRadius="lg"
        p={6}
        boxShadow="md"
        overflowX="auto"
      >
        {loading ? (
          <SkeletonText mt="4" noOfLines={10} spacing="4" skeletonHeight="10" />
        ) : filteredDrainers.length === 0 ? (
          <Text color="gray.400" textAlign="center" py={8}>
            No wallet drainers found matching your criteria.
          </Text>
        ) : (
          <Table variant="simple" color="gray.200">
            <Thead>
              <Tr>
                <Th color="gray.400">Address</Th>
                <Th color="gray.400">Name</Th>
                <Th color="gray.400">Risk Level</Th>
                <Th color="gray.400" isNumeric>Victims</Th>
                <Th color="gray.400" isNumeric>Total Stolen (ETN)</Th>
                <Th color="gray.400">Last Active</Th>
                <Th color="gray.400">Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredDrainers.map((drainer) => (
                <Tr key={drainer.address} _hover={{ bg: 'gray.700' }}>
                  <Td>
                    <Link
                      as={RouterLink}
                      to={`/wallet-drainers/${drainer.address}`}
                      color="electroneum.400"
                      fontFamily="monospace"
                      fontWeight="medium"
                    >
                      {formatAddress(drainer.address)}
                    </Link>
                  </Td>
                  <Td>{drainer.name}</Td>
                  <Td>
                    <Badge {...getRiskBadgeProps(drainer.riskLevel)} />
                  </Td>
                  <Td isNumeric>{drainer.victims}</Td>
                  <Td isNumeric>{drainer.totalStolen.toLocaleString()}</Td>
                  <Td>{formatDate(drainer.lastActive)}</Td>
                  <Td>
                    <Badge
                      colorScheme={drainer.isVerified ? 'green' : 'gray'}
                    >
                      {drainer.isVerified ? 'Verified' : 'Unverified'}
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
    </Box>
  );
};

export default WalletDrainers; 