import csv
import os
import openpyxl
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side
from openpyxl.utils import get_column_letter

input_csv_path = '/Users/nithinselvaraj/Desktop/buildit_complete_catalog_inventory.csv'
output_xlsx_path = '/Users/nithinselvaraj/Desktop/buildit_complete_catalog_inventory.xlsx'
output_csv_path = '/Users/nithinselvaraj/Desktop/buildit_complete_catalog_inventory_with_images.csv'
output_html_path = '/Users/nithinselvaraj/Desktop/buildit_visual_catalog_spreadsheet.html'

rows = []
with open(input_csv_path, mode='r', encoding='utf-8') as f:
    reader = csv.reader(f)
    for row in reader:
        if row:
            rows.append(row)

if not rows:
    print("CSV is empty!")
    exit(1)

headers = rows[0]
data_rows = rows[1:]

print(f"Total rows to process: {len(data_rows)}")
print(f"Headers: {headers}")

# Find image URL column index
image_col_idx = 3 # "Product Image URL"

# 1. Update CSV with =IMAGE("url") formula
updated_csv_headers = [
    'Section / Category',
    'SKU / Service ID',
    'Item / Service Name',
    'Product Image (Thumbnail Formula)',
    'Direct Image URL',
    'Brand / Provider',
    'Package / Unit',
    'Current Price (INR)',
    'MRP / Original Price (INR)',
    'Discount %',
    'Delivery Speed',
    'In Stock / Lead Time',
    'Rating',
    'Key Specifications & Description'
]

updated_csv_rows = []
for r in data_rows:
    img_url = r[3] if len(r) > 3 else ''
    image_formula = f'=IMAGE("{img_url}")' if img_url else ''
    new_row = [
        r[0], # Category
        r[1], # SKU
        r[2], # Name
        image_formula, # =IMAGE("url")
        img_url, # Direct URL
        r[4], # Brand
        r[5], # Unit
        r[6], # Price
        r[7], # MRP
        r[8], # Discount
        r[9], # Delivery
        r[10], # Stock
        r[11], # Rating
        r[12] if len(r) > 12 else '' # Specs
    ]
    updated_csv_rows.append(new_row)

# Overwrite original CSV and save updated CSV
with open(input_csv_path, mode='w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(updated_csv_headers)
    writer.writerows(updated_csv_rows)

with open(output_csv_path, mode='w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(updated_csv_headers)
    writer.writerows(updated_csv_rows)

print(f"Saved updated CSV to {input_csv_path} and {output_csv_path}")

# 2. Build High-End Styled Excel (.xlsx) Workbook
wb = openpyxl.Workbook()
ws = wb.active
ws.title = "BuildIt Catalog & Inventory"
ws.views.sheetView[0].showGridLines = True

# Styling definitions
header_fill = PatternFill(start_color="062B32", end_color="062B32", fill_type="solid")
header_font = Font(name="Arial", size=11, bold=True, color="FFFFFF")
accent_fill = PatternFill(start_color="D8F43A", end_color="D8F43A", fill_type="solid")
accent_font = Font(name="Arial", size=11, bold=True, color="071C20")

regular_font = Font(name="Arial", size=10, color="102326")
sku_font = Font(name="Courier New", size=10, bold=True, color="062B32")
price_font = Font(name="Arial", size=10, bold=True, color="071C20")
mrp_font = Font(name="Arial", size=9, color="66736F")
discount_font = Font(name="Arial", size=10, bold=True, color="067A50")

thin_border_side = Side(border_style="thin", color="D7DDD8")
cell_border = Border(left=thin_border_side, right=thin_border_side, top=thin_border_side, bottom=thin_border_side)

zebra_fill_1 = PatternFill(start_color="FAFAF6", end_color="FAFAF6", fill_type="solid")
zebra_fill_2 = PatternFill(start_color="FFFFFF", end_color="FFFFFF", fill_type="solid")

# Write Headers
for col_num, header_text in enumerate(updated_csv_headers, 1):
    cell = ws.cell(row=1, column=col_num, value=header_text)
    cell.fill = header_fill
    cell.font = header_font
    cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    cell.border = cell_border

ws.row_dimensions[1].height = 36

# Write Data Rows
for row_idx, r_data in enumerate(updated_csv_rows, 2):
    ws.row_dimensions[row_idx].height = 65 # Generous height for image thumbnail
    fill_color = zebra_fill_1 if row_idx % 2 == 0 else zebra_fill_2

    for col_idx, val in enumerate(r_data, 1):
        cell = ws.cell(row=row_idx, column=col_idx)
        cell.fill = fill_color
        cell.border = cell_border
        cell.font = regular_font

        # Column specific formatting
        if col_idx == 1: # Category
            cell.value = val
            cell.alignment = Alignment(horizontal="left", vertical="center")
            cell.font = Font(name="Arial", size=10, bold=True, color="062B32")
        elif col_idx == 2: # SKU
            cell.value = val
            cell.alignment = Alignment(horizontal="center", vertical="center")
            cell.font = sku_font
        elif col_idx == 3: # Item Name
            cell.value = val
            cell.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
            cell.font = Font(name="Arial", size=10, bold=True, color="102326")
        elif col_idx == 4: # Image Formula
            cell.value = val # =IMAGE("...")
            cell.alignment = Alignment(horizontal="center", vertical="center")
        elif col_idx == 5: # Image URL
            cell.value = val
            cell.alignment = Alignment(horizontal="left", vertical="center")
            cell.font = Font(name="Arial", size=9, color="2563EB", underline="single")
        elif col_idx == 6: # Brand
            cell.value = val
            cell.alignment = Alignment(horizontal="left", vertical="center")
            cell.font = Font(name="Arial", size=10, bold=True, color="334155")
        elif col_idx == 7: # Unit
            cell.value = val
            cell.alignment = Alignment(horizontal="center", vertical="center")
        elif col_idx == 8: # Price
            try:
                num_val = float(str(val).replace(',', '').replace('₹', '').strip())
                cell.value = num_val
                cell.number_format = '₹#,##0'
            except:
                cell.value = val
            cell.alignment = Alignment(horizontal="right", vertical="center")
            cell.font = price_font
        elif col_idx == 9: # MRP
            try:
                num_val = float(str(val).replace(',', '').replace('₹', '').strip())
                cell.value = num_val
                cell.number_format = '₹#,##0'
            except:
                cell.value = val
            cell.alignment = Alignment(horizontal="right", vertical="center")
            cell.font = mrp_font
        elif col_idx == 10: # Discount
            cell.value = val
            cell.alignment = Alignment(horizontal="center", vertical="center")
            cell.font = discount_font
        elif col_idx == 11: # Delivery
            cell.value = val
            cell.alignment = Alignment(horizontal="center", vertical="center")
            cell.font = Font(name="Arial", size=9, bold=True, color="062B32")
        elif col_idx == 12: # Stock
            cell.value = val
            cell.alignment = Alignment(horizontal="center", vertical="center")
            cell.font = Font(name="Arial", size=9, bold=True, color="047857")
        elif col_idx == 13: # Rating
            cell.value = val
            cell.alignment = Alignment(horizontal="center", vertical="center")
        elif col_idx == 14: # Description
            cell.value = val
            cell.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)

# Set Column Widths
col_widths = {
    1: 24, # Category
    2: 18, # SKU
    3: 36, # Item Name
    4: 18, # Thumbnail Formula
    5: 35, # Direct Image URL
    6: 20, # Brand
    7: 22, # Unit
    8: 16, # Price
    9: 16, # MRP
    10: 12, # Discount
    11: 14, # Delivery
    12: 16, # Stock
    13: 15, # Rating
    14: 45, # Description
}

for col_num, width in col_widths.items():
    col_letter = get_column_letter(col_num)
    ws.column_dimensions[col_letter].width = width

# Enable auto-filter
ws.auto_filter.ref = f"A1:N{len(updated_csv_rows) + 1}"

# Freeze top header row
ws.freeze_panes = "A2"

wb.save(output_xlsx_path)
print(f"Saved styled Excel workbook with live image formulas to {output_xlsx_path}")

# 3. Generate Visual Interactive HTML Spreadsheet with Live Embedded <img> Preview
html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>BuildIt — Complete Visual Catalog & Parts Inventory Spreadsheet</title>
<style>
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #F4F3ED; color: #102326; padding: 24px; }}
  .header-card {{ background: #062B32; color: #FAFAF6; padding: 24px 32px; border-radius: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #071C20; }}
  .header-card h1 {{ font-size: 22px; font-weight: 900; letter-spacing: -0.5px; }}
  .header-card h1 span {{ color: #D8F43A; }}
  .header-card p {{ font-size: 13px; color: #D7DDD8; margin-top: 4px; font-family: monospace; }}
  .badge {{ background: #D8F43A; color: #071C20; font-weight: 800; font-size: 12px; padding: 6px 12px; border-radius: 6px; font-family: monospace; }}
  
  .controls-bar {{ background: #FAFAF6; padding: 16px 20px; border-radius: 10px; border: 1px solid #D7DDD8; margin-bottom: 20px; display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }}
  .search-input {{ flex: 1; min-width: 260px; padding: 10px 14px; border: 1px solid #D7DDD8; border-radius: 6px; font-size: 13px; font-family: monospace; outline: none; background: #FFF; }}
  .search-input:focus {{ border-color: #062B32; }}
  .category-select {{ padding: 10px 14px; border: 1px solid #D7DDD8; border-radius: 6px; font-size: 13px; font-family: monospace; outline: none; background: #FFF; font-weight: 700; }}
  .count-badge {{ font-size: 13px; font-family: monospace; font-weight: 700; color: #66736F; }}
  
  .table-container {{ background: #FFF; border-radius: 10px; border: 1px solid #D7DDD8; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }}
  .table-wrapper {{ overflow-x: auto; max-height: 75vh; }}
  table {{ width: 100%; border-collapse: collapse; font-size: 12px; text-align: left; }}
  
  thead th {{ position: sticky; top: 0; background: #062B32; color: #FAFAF6; font-weight: 800; text-transform: uppercase; font-size: 10.5px; letter-spacing: 0.5px; padding: 12px 14px; border-bottom: 2px solid #071C20; z-index: 10; white-space: nowrap; font-family: monospace; }}
  tbody tr {{ border-bottom: 1px solid #EEEEE8; transition: background 0.15s; }}
  tbody tr:hover {{ background: #F4F3ED; }}
  tbody tr:nth-child(even) {{ background: #FAFAF6; }}
  tbody tr:nth-child(even):hover {{ background: #F4F3ED; }}
  
  td {{ padding: 10px 14px; vertical-align: middle; }}
  .img-cell {{ width: 80px; text-align: center; }}
  .img-thumb {{ width: 64px; height: 64px; object-fit: cover; border-radius: 6px; border: 1px solid #D7DDD8; background: #EEEEE8; display: block; }}
  .sku-badge {{ font-family: monospace; font-weight: 700; background: #EEEEE8; color: #062B32; padding: 3px 6px; border-radius: 4px; font-size: 11px; border: 1px solid #D7DDD8; white-space: nowrap; }}
  .price-text {{ font-family: monospace; font-weight: 800; color: #071C20; font-size: 13px; }}
  .mrp-text {{ font-family: monospace; color: #94A3B8; text-decoration: line-through; font-size: 11px; }}
  .discount-tag {{ font-family: monospace; font-weight: 800; color: #047857; background: #D1FAE5; padding: 2px 6px; border-radius: 4px; font-size: 11px; }}
  .stock-dot {{ display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #10B981; margin-right: 4px; }}
</style>
</head>
<body>

<div class="header-card">
  <div>
    <h1>BUILD<span>IT</span> — Master Parts Catalog & Inventory Visual Spreadsheet</h1>
    <p>462 Verified Hardware, Electronics, Fasteners, Plumbing, Paints & Tool Rental SKUs</p>
  </div>
  <div class="badge">LIVE WAREHOUSE DISPATCH</div>
</div>

<div class="controls-bar">
  <input type="text" id="searchInput" class="search-input" placeholder="Search by Part Name, SKU, Brand, or Specification..." onkeyup="filterTable()">
  <select id="categoryFilter" class="category-select" onchange="filterTable()">
    <option value="ALL">All Categories (462 Items)</option>
    <option value="Fasteners & Hardware">Fasteners & Hardware (183)</option>
    <option value="Plumbing & PVC Fittings">Plumbing & PVC Fittings (101)</option>
    <option value="Paints & Finishes">Paints & Finishes (46)</option>
    <option value="Cement & Raw Materials">Cement & Raw Materials (17)</option>
    <option value="Power Tools & Machinery">Power Tools & Machinery (15)</option>
    <option value="Electricals & Cables">Electricals & Cables (15)</option>
    <option value="Painting Supplies & Tools">Painting Supplies & Tools (15)</option>
    <option value="Hand Tools & Measuring">Hand Tools & Measuring (14)</option>
    <option value="Door Hardware & Fittings">Door Hardware & Fittings (13)</option>
    <option value="Adhesives & Sealants">Adhesives & Sealants (13)</option>
    <option value="Li-Ion Batteries & Power">Li-Ion Batteries & Power (8)</option>
    <option value="Site Safety & PPE">Site Safety & PPE (8)</option>
    <option value="Electronics & Robotics">Electronics & Robotics (7)</option>
    <option value="CAD & Blueprints">CAD & Blueprints (5)</option>
    <option value="On-Demand Fabrication">On-Demand Fabrication (2)</option>
  </select>
  <div id="countDisplay" class="count-badge">Showing 462 products</div>
</div>

<div class="table-container">
  <div class="table-wrapper">
    <table id="catalogTable">
      <thead>
        <tr>
          <th>Image</th>
          <th>SKU / ID</th>
          <th>Product / Service Name</th>
          <th>Category</th>
          <th>Brand / Manufacturer</th>
          <th>Unit / Pack</th>
          <th>Price (INR)</th>
          <th>MRP (INR)</th>
          <th>Discount</th>
          <th>Delivery Speed</th>
          <th>Stock Status</th>
          <th>Rating</th>
          <th>Specifications & Notes</th>
        </tr>
      </thead>
      <tbody>
"""

for r in data_rows:
    img_url = r[3] if len(r) > 3 else ''
    category = r[0]
    sku = r[1]
    name = r[2]
    brand = r[4]
    unit = r[5]
    price = r[6]
    mrp = r[7]
    discount = r[8]
    delivery = r[9]
    stock = r[10]
    rating = r[11]
    desc = r[12] if len(r) > 12 else ''

    html_content += f"""        <tr data-category="{category}">
          <td class="img-cell"><img src="{img_url}" class="img-thumb" alt="{name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200&auto=format&fit=crop&q=80'"></td>
          <td><span class="sku-badge">{sku}</span></td>
          <td><strong>{name}</strong></td>
          <td>{category}</td>
          <td><strong>{brand}</strong></td>
          <td>{unit}</td>
          <td><span class="price-text">₹{price}</span></td>
          <td><span class="mrp-text">₹{mrp}</span></td>
          <td><span class="discount-tag">{discount}</span></td>
          <td><strong>{delivery}</strong></td>
          <td><span class="stock-dot"></span>{stock}</td>
          <td>{rating}</td>
          <td style="color:#66736F; font-size:11.5px; max-width:280px;">{desc}</td>
        </tr>
"""

html_content += """      </tbody>
    </table>
  </div>
</div>

<script>
function filterTable() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const selectedCat = document.getElementById('categoryFilter').value;
  const table = document.getElementById('catalogTable');
  const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
  let visibleCount = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const cat = row.getAttribute('data-category');
    const text = row.textContent.toLowerCase();
    
    const matchesCat = (selectedCat === 'ALL' || cat === selectedCat);
    const matchesQuery = !query || text.includes(query);

    if (matchesCat && matchesQuery) {
      row.style.display = '';
      visibleCount++;
    } else {
      row.style.display = 'none';
    }
  }

  document.getElementById('countDisplay').textContent = 'Showing ' + visibleCount + ' of ' + rows.length + ' products';
}
</script>

</body>
</html>
"""

with open(output_html_path, mode='w', encoding='utf-8') as f:
    f.write(html_content)

print(f"Saved visual HTML spreadsheet to {output_html_path}")
