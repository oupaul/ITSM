import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  Alert,
  Rating,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  AccessTime as TimeIcon,
  Star as StarIcon,
} from '@mui/icons-material';

const TicketStatistics = ({ 
  tickets, 
  ticketGroups, 
  customers, 
  technicians,
  getStatusText,
  getStatusColor,
  getStatusIcon,
  getPriorityText,
  getPriorityColor,
  getCategoryText,
  getCategoryIcon
}) => {
  // 如果沒有工單數據，顯示提示
  if (!tickets || tickets.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography>
          選定時間範圍內沒有工單資料可供統計。
        </Typography>
      </Alert>
    );
  }
  return (
    <Box>
      {/* 統計圖表區域 */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
        gap: 3, 
        mb: 3 
      }}>
        {/* 狀態分布圖 */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>工單狀態分布</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {Object.entries(ticketGroups).map(([status, ticketList]) => {
                const total = Object.values(ticketGroups).reduce((sum, group) => sum + group.length, 0);
                const percentage = total > 0 ? Math.round((ticketList.length / total) * 100) : 0;
                
                return (
                  <Box key={status} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ minWidth: 80 }}>
                      <Chip
                        icon={getStatusIcon(status)}
                        label={getStatusText(status)}
                        color={getStatusColor(status)}
                        size="small"
                      />
                    </Box>
                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2">{ticketList.length} 個</Typography>
                        <Typography variant="body2" color="text.secondary">{percentage}%</Typography>
                      </Box>
                      <Box
                        sx={{
                          height: 8,
                          borderRadius: 1,
                          bgcolor: 'grey.200',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            height: '100%',
                            width: `${percentage}%`,
                            bgcolor: `${getStatusColor(status)}.main`,
                            borderRadius: 1,
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </CardContent>
        </Card>

        {/* 優先級分布圖 */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>優先級分布</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {['urgent', 'high', 'medium', 'low'].map((priority) => {
                const priorityTickets = tickets.filter(ticket => ticket.priority === priority);
                const percentage = tickets.length > 0 ? Math.round((priorityTickets.length / tickets.length) * 100) : 0;
                
                return (
                  <Box key={priority} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ minWidth: 60 }}>
                      <Chip
                        label={getPriorityText(priority)}
                        color={getPriorityColor(priority)}
                        size="small"
                      />
                    </Box>
                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2">{priorityTickets.length} 個</Typography>
                        <Typography variant="body2" color="text.secondary">{percentage}%</Typography>
                      </Box>
                      <Box
                        sx={{
                          height: 8,
                          borderRadius: 1,
                          bgcolor: 'grey.200',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            height: '100%',
                            width: `${percentage}%`,
                            bgcolor: `${getPriorityColor(priority)}.main`,
                            borderRadius: 1,
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </CardContent>
        </Card>

        {/* 類別分布圖 */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>問題類別分布</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {['hardware', 'software', 'network', 'security', 'other'].map((category) => {
                const categoryTickets = tickets.filter(ticket => ticket.category === category);
                const percentage = tickets.length > 0 ? Math.round((categoryTickets.length / tickets.length) * 100) : 0;
                
                return (
                  <Box key={category} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ minWidth: 60 }}>
                      <Chip
                        icon={getCategoryIcon(category)}
                        label={getCategoryText(category)}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2">{categoryTickets.length} 個</Typography>
                        <Typography variant="body2" color="text.secondary">{percentage}%</Typography>
                      </Box>
                      <Box
                        sx={{
                          height: 8,
                          borderRadius: 1,
                          bgcolor: 'grey.200',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            height: '100%',
                            width: `${percentage}%`,
                            bgcolor: 'info.main',
                            borderRadius: 1,
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </CardContent>
        </Card>

        {/* 技術員工作負載 */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>技術員工作負載</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {technicians.map((technician) => {
                const technicianTickets = tickets.filter(ticket => 
                  ticket.assignedTo === technician.name && 
                  !['resolved', 'closed'].includes(ticket.status)
                );
                const maxWorkload = Math.max(...technicians.map(t => t.workload), 5);
                const workloadPercentage = Math.round((technician.workload / maxWorkload) * 100);
                
                return (
                  <Box key={technician.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ minWidth: 80 }}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                          {technician.name.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" noWrap>
                          {technician.name}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2">{technicianTickets.length} 個進行中</Typography>
                        <Typography variant="body2" color="text.secondary">
                          負載: {technician.workload}/{maxWorkload}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          height: 8,
                          borderRadius: 1,
                          bgcolor: 'grey.200',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            height: '100%',
                            width: `${workloadPercentage}%`,
                            bgcolor: workloadPercentage > 80 ? 'error.main' : 
                                     workloadPercentage > 60 ? 'warning.main' : 'success.main',
                            borderRadius: 1,
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* 詳細統計表格 */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, 
        gap: 3 
      }}>
        {/* 客戶工單統計 */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>客戶工單統計</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {customers.map((customer) => {
                const customerTickets = tickets.filter(ticket => ticket.customerId === customer.id);
                const openTickets = customerTickets.filter(ticket => 
                  ['open', 'pending', 'in_progress'].includes(ticket.status)
                );
                const resolvedTickets = customerTickets.filter(ticket => 
                  ['resolved', 'closed'].includes(ticket.status)
                );
                const resolutionRate = customerTickets.length > 0 ? 
                  Math.round((resolvedTickets.length / customerTickets.length) * 100) : 0;
                
                return (
                  <Box key={customer.id} sx={{ 
                    p: 2, 
                    border: '1px solid', 
                    borderColor: 'divider', 
                    borderRadius: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Box>
                      <Typography variant="subtitle2">{customer.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        總計: {customerTickets.length} | 
                        進行中: {openTickets.length} | 
                        已完成: {resolvedTickets.length}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" color="success.main">
                        {resolutionRate}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        完成率
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </CardContent>
        </Card>

        {/* 效率指標 */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>效率指標</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* 平均處理時間 */}
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  平均處理時間
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <TimeIcon color="action" />
                  <Typography variant="h5">
                    {(() => {
                      const resolvedTicketsWithTime = tickets.filter(ticket => 
                        ticket.status === 'resolved' && ticket.timeSpent > 0
                      );
                      const avgTime = resolvedTicketsWithTime.length > 0 ?
                        resolvedTicketsWithTime.reduce((sum, ticket) => sum + ticket.timeSpent, 0) / resolvedTicketsWithTime.length :
                        0;
                      return avgTime.toFixed(1);
                    })()}h
                  </Typography>
                </Box>
              </Box>

              {/* 解決率 */}
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  工單解決率
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <CheckCircleIcon color="success" />
                  <Typography variant="h5" color="success.main">
                    {(() => {
                      const resolvedCount = tickets.filter(ticket => 
                        ['resolved', 'closed'].includes(ticket.status)
                      ).length;
                      return tickets.length > 0 ? Math.round((resolvedCount / tickets.length) * 100) : 0;
                    })()}%
                  </Typography>
                </Box>
              </Box>

              {/* 客戶滿意度 */}
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  平均滿意度
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <StarIcon color="warning" />
                  <Typography variant="h5">
                    {(() => {
                      const ratedTickets = tickets.filter(ticket => ticket.satisfaction !== null);
                      const avgRating = ratedTickets.length > 0 ?
                        ratedTickets.reduce((sum, ticket) => sum + ticket.satisfaction, 0) / ratedTickets.length :
                        0;
                      return avgRating.toFixed(1);
                    })()}
                  </Typography>
                  <Rating 
                    value={(() => {
                      const ratedTickets = tickets.filter(ticket => ticket.satisfaction !== null);
                      return ratedTickets.length > 0 ?
                        ratedTickets.reduce((sum, ticket) => sum + ticket.satisfaction, 0) / ratedTickets.length :
                        0;
                    })()} 
                    readOnly 
                    size="small" 
                  />
                </Box>
              </Box>

              {/* 回應時間 */}
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  平均回應時間
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <ScheduleIcon color="info" />
                  <Typography variant="h5" color="info.main">
                    2.3h
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  從建立到首次回應
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* 趨勢分析 */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>工單趨勢分析</Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography>
              📈 本月工單數量較上月增加 15%<br/>
              ⚡ 平均處理時間較上月減少 8%<br/>
              😊 客戶滿意度持續保持在 4.5 星以上<br/>
              🔧 硬體問題佔比最高，建議加強預防性維護
            </Typography>
          </Alert>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TicketStatistics;
