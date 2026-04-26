using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using AgriTrackAPI.Data;
using AgriTrackAPI.Models;

namespace AgriTrackAPI.Services
{
    public interface IReportService
    {
        Task<byte[]> GenerateMonthlyReportAsync(int year, int month);
        Task<byte[]> GenerateAnnualReportAsync(int year);
        Task<byte[]> GenerateUserReportAsync();
    }

    public class ReportService : IReportService
    {
        private readonly ApplicationDbContext _context;

        public ReportService(ApplicationDbContext context)
        {
            _context = context;
            // Set EPPlus license for non-commercial use
            ExcelPackage.License.SetNonCommercialPersonal("AgriTrack");
        }

        public async Task<byte[]> GenerateMonthlyReportAsync(int year, int month)
        {
            using var package = new ExcelPackage();
            var worksheet = package.Workbook.Worksheets.Add($"Report_{year}_{month}");

            // Get data for the month
            var startDate = new DateTime(year, month, 1);
            var endDate = startDate.AddMonths(1).AddDays(-1);

            var sales = await _context.Sales
                .Where(s => s.SaleDate >= startDate && s.SaleDate <= endDate)
                .Include(s => s.User)
                .ToListAsync();

            // Headers
            worksheet.Cells["A1"].Value = $"AgriTrack Monthly Report - {startDate:MMMM yyyy}";
            worksheet.Cells["A1"].Style.Font.Size = 16;
            worksheet.Cells["A1"].Style.Font.Bold = true;

            // Summary
            worksheet.Cells["A3"].Value = "Total Sales Revenue:";
            worksheet.Cells["B3"].Value = sales.Sum(s => s.TotalAmount);
            worksheet.Cells["B3"].Style.Numberformat.Format = "#,##0.00";

            worksheet.Cells["A4"].Value = "Number of Sales:";
            worksheet.Cells["B4"].Value = sales.Count;

            // Sales Details
            worksheet.Cells["A6"].Value = "Date";
            worksheet.Cells["B6"].Value = "Farmer";
            worksheet.Cells["C6"].Value = "Crop";
            worksheet.Cells["D6"].Value = "Quantity (kg)";
            worksheet.Cells["E6"].Value = "Price/kg";
            worksheet.Cells["F6"].Value = "Total";

            for (int i = 0; i < sales.Count; i++)
            {
                worksheet.Cells[$"A{i + 7}"].Value = sales[i].SaleDate.ToString("yyyy-MM-dd");
                worksheet.Cells[$"B{i + 7}"].Value = sales[i].User?.FullName ?? "N/A";
                worksheet.Cells[$"C{i + 7}"].Value = sales[i].CropType;
                worksheet.Cells[$"D{i + 7}"].Value = sales[i].Quantity;
                worksheet.Cells[$"E{i + 7}"].Value = sales[i].PricePerUnit;
                worksheet.Cells[$"F{i + 7}"].Value = sales[i].TotalAmount;
                worksheet.Cells[$"F{i + 7}"].Style.Numberformat.Format = "#,##0.00";
            }

            worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();

            return await package.GetAsByteArrayAsync();
        }

        public async Task<byte[]> GenerateAnnualReportAsync(int year)
        {
            using var package = new ExcelPackage();
            var worksheet = package.Workbook.Worksheets.Add($"Annual_Report_{year}");

            var startDate = new DateTime(year, 1, 1);
            var endDate = new DateTime(year, 12, 31);

            var monthlySales = await _context.Sales
                .Where(s => s.SaleDate.Year == year)
                .GroupBy(s => s.SaleDate.Month)
                .Select(g => new { Month = g.Key, Total = g.Sum(s => s.TotalAmount), Count = g.Count() })
                .OrderBy(x => x.Month)
                .ToListAsync();

            worksheet.Cells["A1"].Value = $"AgriTrack Annual Report - {year}";
            worksheet.Cells["A1"].Style.Font.Size = 16;
            worksheet.Cells["A1"].Style.Font.Bold = true;

            worksheet.Cells["A3"].Value = "Month";
            worksheet.Cells["B3"].Value = "Sales Count";
            worksheet.Cells["C3"].Value = "Revenue";

            for (int i = 1; i <= 12; i++)
            {
                var monthData = monthlySales.FirstOrDefault(m => m.Month == i);
                worksheet.Cells[$"A{i + 3}"].Value = new DateTime(year, i, 1).ToString("MMMM");
                worksheet.Cells[$"B{i + 3}"].Value = monthData?.Count ?? 0;
                worksheet.Cells[$"C{i + 3}"].Value = monthData?.Total ?? 0;
                worksheet.Cells[$"C{i + 3}"].Style.Numberformat.Format = "#,##0.00";
            }

            // Total row
            worksheet.Cells["A16"].Value = "TOTAL";
            worksheet.Cells["A16"].Style.Font.Bold = true;
            worksheet.Cells["B16"].Value = monthlySales.Sum(m => m.Count);
            worksheet.Cells["C16"].Value = monthlySales.Sum(m => m.Total);
            worksheet.Cells["C16"].Style.Numberformat.Format = "#,##0.00";

            worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();

            return await package.GetAsByteArrayAsync();
        }

        public async Task<byte[]> GenerateUserReportAsync()
        {
            using var package = new ExcelPackage();
            var worksheet = package.Workbook.Worksheets.Add("Users_Report");

            var users = await _context.Users
                .Select(u => new
                {
                    u.FullName,
                    u.Email,
                    u.FarmName,
                    u.Role,
                    u.IsActive,
                    u.CreatedAt,
                    u.LastLoginAt,
                    CropCount = u.Crops.Count,
                    SalesTotal = u.Sales.Sum(s => s.TotalAmount)
                })
                .OrderBy(u => u.Role)
                .ThenBy(u => u.FullName)
                .ToListAsync();

            worksheet.Cells["A1"].Value = "AgriTrack User Report";
            worksheet.Cells["A1"].Style.Font.Size = 16;
            worksheet.Cells["A1"].Style.Font.Bold = true;

            worksheet.Cells["A2"].Value = $"Generated: {DateTime.Now:yyyy-MM-dd HH:mm}";

            worksheet.Cells["A4"].Value = "Name";
            worksheet.Cells["B4"].Value = "Email";
            worksheet.Cells["C4"].Value = "Farm";
            worksheet.Cells["D4"].Value = "Role";
            worksheet.Cells["E4"].Value = "Status";
            worksheet.Cells["F4"].Value = "Crops";
            worksheet.Cells["G4"].Value = "Total Sales";
            worksheet.Cells["H4"].Value = "Joined";
            worksheet.Cells["I4"].Value = "Last Login";

            for (int i = 0; i < users.Count; i++)
            {
                worksheet.Cells[$"A{i + 5}"].Value = users[i].FullName;
                worksheet.Cells[$"B{i + 5}"].Value = users[i].Email;
                worksheet.Cells[$"C{i + 5}"].Value = users[i].FarmName ?? "N/A";
                worksheet.Cells[$"D{i + 5}"].Value = users[i].Role;
                worksheet.Cells[$"E{i + 5}"].Value = users[i].IsActive ? "Active" : "Inactive";
                worksheet.Cells[$"F{i + 5}"].Value = users[i].CropCount;
                worksheet.Cells[$"G{i + 5}"].Value = users[i].SalesTotal;
                worksheet.Cells[$"G{i + 5}"].Style.Numberformat.Format = "#,##0.00";
                worksheet.Cells[$"H{i + 5}"].Value = users[i].CreatedAt.ToString("yyyy-MM-dd");
                worksheet.Cells[$"I{i + 5}"].Value = users[i].LastLoginAt?.ToString("yyyy-MM-dd HH:mm") ?? "Never";
            }

            worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();

            return await package.GetAsByteArrayAsync();
        }
    }
}