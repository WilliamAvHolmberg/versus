'use server'

import { prisma } from '../lib/db'

export async function rollupDailyStats(date: Date = new Date()) {
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)
  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  const [pageviews, uniqueUsers, bookmarks, clicks] = await Promise.all([
    // Total pageviews
    prisma.analytics.count({
      where: {
        type: 'pageview',
        timestamp: { gte: startOfDay, lte: endOfDay }
      }
    }),
    // Unique visitors
    prisma.analytics.groupBy({
      by: ['userId'],
      where: {
        timestamp: { gte: startOfDay, lte: endOfDay },
        userId: { not: null }
      }
    }).then(results => results.length),
    // New bookmarks
    prisma.analytics.count({
      where: {
        type: 'bookmark_create',
        timestamp: { gte: startOfDay, lte: endOfDay }
      }
    }),
    // Total clicks
    prisma.analytics.count({
      where: {
        type: 'bookmark_click',
        timestamp: { gte: startOfDay, lte: endOfDay }
      }
    })
  ])

  // Update or create daily stats
  await prisma.dailyStats.upsert({
    where: { date: startOfDay },
    create: {
      date: startOfDay,
      totalPageviews: pageviews,
      uniqueVisitors: uniqueUsers,
      totalBookmarks: bookmarks,
      totalClicks: clicks,
      activeUsers: uniqueUsers
    },
    update: {
      totalPageviews: pageviews,
      uniqueVisitors: uniqueUsers,
      totalBookmarks: bookmarks,
      totalClicks: clicks,
      activeUsers: uniqueUsers
    }
  })
} 