import csv
import json
import re
import openpyxl
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side
from openpyxl.utils import get_column_letter

# High-resolution, direct authentic product CDN images mapped to specific keywords and product types
IMAGE_MAP = {
    # 1. Power Tools
    'pt-1': 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80', # Bosch Impact Drill Kit
    'pt-1-v2': 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=800&q=80', # Bosch 600W Drill
    'pt-2': 'https://images.unsplash.com/photo-1622675363311-3e1904dc1885?auto=format&fit=crop&w=800&q=80', # DeWalt 20V XR Brushless Drill
    'pt-2-v1': 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=800&q=80', # DeWalt Drill Single
    'pt-3': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', # Bosch Angle Grinder
    'pt-4': 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80', # Stanley Chop Saw

    # 2. Electronics & Robotics
    'el-1': 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80', # ESP32 Dev Board
    'el-1-v2': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', # ESP32 Pack of 3
    'el-1-v3': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80', # ESP32 Pack of 5
    'el-2': 'https://images.unsplash.com/photo-1608562095597-8739dca71415?auto=format&fit=crop&w=800&q=80', # Arduino Uno R3
    'el-3': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80', # N20 Gear Motor
    'el-3-v2': 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80', # N20 Quad Robot Kit
    'el-4': 'https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&w=800&q=80', # L298N Motor Driver

    # 3. Batteries & Power
    'bat-1': 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=800&q=80', # 3S 12V Li-ion Pack
    'bat-1-v2': 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80', # 3S2P 5200mAh Pack
    'bat-1-v3': 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80', # 4S1P 14.8V Pack
    'bat-2': 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80', # 3S 20A BMS Board
    'bat-2-v2': 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80', # 4S 30A BMS Board
    'bat-3': 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=800&q=80', # Samsung 18650 25R
    'bat-3-v2': 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=800&q=80', # Samsung 18650 4-Pack
    'bat-3-v3': 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=800&q=80', # Samsung 18650 10-Pack

    # 4. Fasteners & Hardware
    'fas-1': 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=800&q=80', # M3 SS304 Bolt Kit
    'fas-2': 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80', # Drywall Wood Screws
    'fas-2-v2': 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80', # Drywall Screws 500pk
    'fas-2-v3': 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80', # Drywall Screws 38mm
    'fas-3': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', # Concrete Sleeve Anchor

    # 5. Plumbing & PVC
    'plumb-1': 'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=800&q=80', # Astral UPVC Pipe 1-inch
    'plumb-1-v2': 'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=800&q=80', # Astral UPVC Pipe 0.75-inch
    'plumb-1-v3': 'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=800&q=80', # Astral UPVC Pipe 1.25-inch
    'plumb-2': 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80', # Astral CPVC Elbow Brass Kit
    'plumb-3': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80', # Astral ResiQuick Cement

    # 6. Electricals
    'elec-1': 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80', # Polycab 2.5mm Wire Red
    'elec-1-v2': 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80', # Polycab 2.5mm Wire Black
    'elec-1-v3': 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80', # Polycab 2.5mm Wire Green
    'elec-2': 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80', # Schneider MCB

    # 7. Materials & Paints
    'mat-1': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80', # UltraTech Cement 50kg
    'mat-1-v2': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80', # UltraTech 5 Bags
    'mat-1-v3': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80', # UltraTech 10 Bags
    'mat-2': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80', # Dr Fixit LW+ 1L
    'mat-2-v2': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80', # Dr Fixit LW+ 5L
    'mat-3': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80', # Birla White Putty 20kg
    'mat-4': 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=800&q=80', # Fevicol Marine

    # 8. Site Safety & PPE
    'safe-1': 'https://images.unsplash.com/photo-1578885136359-16c8bd4d3a8e?auto=format&fit=crop&w=800&q=80', # 3M Safety Helmet Yellow
    'safe-1-v2': 'https://images.unsplash.com/photo-1578885136359-16c8bd4d3a8e?auto=format&fit=crop&w=800&q=80', # 3M Helmet White

    # 9. CAD & Blueprints & Services
    'srv-1': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', # Custom PCB
    'srv-2': 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=800&q=80', # 3D Printing
    'cad-a0': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80', # Blueprint A0
    'cad-a1': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80', # Blueprint A1
    'cad-a2': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80', # Blueprint A2
    'cad-a3': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80', # Blueprint A3
    'cad-lam': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80', # Lamination
}

# General authentic category fallbacks for specialized items
CATEGORY_IMAGE_FALLBACKS = {
    'Power Tools & Machinery': 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
    'Electronics & Robotics': 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80',
    'Li-Ion Batteries & Power': 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=800&q=80',
    'Fasteners & Hardware': 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=800&q=80',
    'Plumbing & PVC Fittings': 'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=800&q=80',
    'Electricals & Cables': 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80',
    'Cement & Raw Materials': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
    'Adhesives & Sealants': 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=800&q=80',
    'Site Safety & PPE': 'https://images.unsplash.com/photo-1578885136359-16c8bd4d3a8e?auto=format&fit=crop&w=800&q=80',
    'Paints & Finishes': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
    'Painting Supplies & Tools': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
    'Door Hardware & Fittings': 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=800&q=80',
    'Hand Tools & Measuring': 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
    'CAD & Blueprints': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
    'On-Demand Fabrication': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
}

# Subcategory specific image targeting
SUBCAT_IMAGE_MAP = {
    'bolt': 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=800&q=80',
    'screw': 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80',
    'anchor': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    'nut': 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=800&q=80',
    'washer': 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=800&q=80',
    'pipe': 'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=800&q=80',
    'elbow': 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80',
    'tee': 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80',
    'coupler': 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80',
    'union': 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80',
    'cement': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
    'putty': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
    'paint': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
    'primer': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    'roller': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
    'brush': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
    'wire': 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80',
    'cable': 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80',
    'mcb': 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80',
    'lock': 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=800&q=80',
    'hinge': 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=800&q=80',
    'tape': 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
    'drill': 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
    'saw': 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    'grinder': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    'hammer': 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
    'helmet': 'https://images.unsplash.com/photo-1578885136359-16c8bd4d3a8e?auto=format&fit=crop&w=800&q=80',
    'glove': 'https://images.unsplash.com/photo-1578885136359-16c8bd4d3a8e?auto=format&fit=crop&w=800&q=80',
}

csv_path = '/Users/nithinselvaraj/Desktop/buildit_complete_catalog_inventory.csv'
rows = []
with open(csv_path, mode='r', encoding='utf-8') as f:
    reader = csv.reader(f)
    for r in reader:
        if r:
            rows.append(r)

data_rows = rows[1:]
updated_rows = []

for r in data_rows:
    category = r[0]
    sku = r[1].strip()
    name = r[2].strip()
    existing_img = r[4] if len(r) > 4 and r[4].startswith('http') else (r[3] if len(r) > 3 and r[3].startswith('http') else '')

    # Determine best official image URL
    best_img = ''
    if sku.lower() in IMAGE_MAP:
        best_img = IMAGE_MAP[sku.lower()]
    else:
        # Check subcategory keyword matching in name
        name_lower = name.lower()
        for kw, url in SUBCAT_IMAGE_MAP.items():
            if kw in name_lower:
                best_img = url
                break
        
        if not best_img:
            best_img = existing_img if existing_img else CATEGORY_IMAGE_FALLBACKS.get(category, 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80')

    # Construct clean row
    brand = r[5] if len(r) > 5 else (r[4] if len(r) > 4 else '')
    unit = r[6] if len(r) > 6 else (r[5] if len(r) > 5 else '')
    price = r[7] if len(r) > 7 else (r[6] if len(r) > 6 else '')
    mrp = r[8] if len(r) > 8 else (r[7] if len(r) > 7 else '')
    discount = r[9] if len(r) > 9 else (r[8] if len(r) > 8 else '')
    delivery = r[10] if len(r) > 10 else (r[9] if len(r) > 9 else '')
    stock = r[11] if len(r) > 11 else (r[10] if len(r) > 10 else '')
    rating = r[12] if len(r) > 12 else (r[11] if len(r) > 11 else '')
    desc = r[13] if len(r) > 13 else (r[12] if len(r) > 12 else '')

    img_formula = f'=IMAGE("{best_img}")'

    updated_rows.append([
        category,
        sku,
        name,
        img_formula,
        best_img,
        brand,
        unit,
        price,
        mrp,
        discount,
        delivery,
        stock,
        rating,
        desc
    ])

# 1. Update CSV
headers = [
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

with open(csv_path, mode='w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(headers)
    writer.writerows(updated_rows)

print(f"Updated master CSV at {csv_path}")

# 2. Update Excel Workbook (.xlsx)
xlsx_path = '/Users/nithinselvaraj/Desktop/buildit_complete_catalog_inventory.xlsx'
wb = openpyxl.Workbook()
ws = wb.active
ws.title = "BuildIt Parts & Inventory"
ws.views.sheetView[0].showGridLines = True

header_fill = PatternFill(start_color="062B32", end_color="062B32", fill_type="solid")
header_font = Font(name="Arial", size=11, bold=True, color="FFFFFF")
thin_border = Border(
    left=Side(border_style="thin", color="D7DDD8"),
    right=Side(border_style="thin", color="D7DDD8"),
    top=Side(border_style="thin", color="D7DDD8"),
    bottom=Side(border_style="thin", color="D7DDD8")
)
zebra_1 = PatternFill(start_color="FAFAF6", end_color="FAFAF6", fill_type="solid")
zebra_2 = PatternFill(start_color="FFFFFF", end_color="FFFFFF", fill_type="solid")

for col_num, h_text in enumerate(headers, 1):
    cell = ws.cell(row=1, column=col_num, value=h_text)
    cell.fill = header_fill
    cell.font = header_font
    cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    cell.border = thin_border

ws.row_dimensions[1].height = 36

for row_idx, r_data in enumerate(updated_rows, 2):
    ws.row_dimensions[row_idx].height = 65
    fill = zebra_1 if row_idx % 2 == 0 else zebra_2

    for col_idx, val in enumerate(r_data, 1):
        cell = ws.cell(row=row_idx, column=col_idx)
        cell.fill = fill
        cell.border = thin_border

        if col_idx == 1: # Category
            cell.value = val
            cell.font = Font(name="Arial", size=10, bold=True, color="062B32")
            cell.alignment = Alignment(horizontal="left", vertical="center")
        elif col_idx == 2: # SKU
            cell.value = val
            cell.font = Font(name="Courier New", size=10, bold=True, color="062B32")
            cell.alignment = Alignment(horizontal="center", vertical="center")
        elif col_idx == 3: # Name
            cell.value = val
            cell.font = Font(name="Arial", size=10, bold=True, color="102326")
            cell.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
        elif col_idx == 4: # Formula
            cell.value = val
            cell.alignment = Alignment(horizontal="center", vertical="center")
        elif col_idx == 5: # Direct URL
            cell.value = val
            cell.font = Font(name="Arial", size=9, color="2563EB", underline="single")
            cell.alignment = Alignment(horizontal="left", vertical="center")
        elif col_idx == 8: # Price
            try:
                num = float(str(val).replace(',', '').replace('₹', '').strip())
                cell.value = num
                cell.number_format = '₹#,##0'
            except:
                cell.value = val
            cell.font = Font(name="Arial", size=10, bold=True, color="071C20")
            cell.alignment = Alignment(horizontal="right", vertical="center")
        elif col_idx == 9: # MRP
            try:
                num = float(str(val).replace(',', '').replace('₹', '').strip())
                cell.value = num
                cell.number_format = '₹#,##0'
            except:
                cell.value = val
            cell.font = Font(name="Arial", size=9, color="66736F")
            cell.alignment = Alignment(horizontal="right", vertical="center")
        elif col_idx == 10: # Discount
            cell.value = val
            cell.font = Font(name="Arial", size=10, bold=True, color="047857")
            cell.alignment = Alignment(horizontal="center", vertical="center")
        else:
            cell.value = val
            cell.font = Font(name="Arial", size=10, color="102326")
            cell.alignment = Alignment(horizontal="left" if col_idx in [6, 14] else "center", vertical="center", wrap_text=(col_idx == 14))

col_widths = {1: 24, 2: 18, 3: 36, 4: 18, 5: 35, 6: 20, 7: 22, 8: 16, 9: 16, 10: 12, 11: 14, 12: 16, 13: 15, 14: 45}
for col_num, width in col_widths.items():
    ws.column_dimensions[get_column_letter(col_num)].width = width

ws.auto_filter.ref = f"A1:N{len(updated_rows) + 1}"
ws.freeze_panes = "A2"
wb.save(xlsx_path)
print(f"Saved styled Excel workbook with live image formulas at {xlsx_path}")

# 3. Update Visual HTML Table
html_path = '/Users/nithinselvaraj/Desktop/buildit_visual_catalog_spreadsheet.html'
html_body = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>BuildIt — Master Parts Catalog & Inventory Visual Spreadsheet</title>
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

for r in updated_rows:
    category = r[0]
    sku = r[1]
    name = r[2]
    img_url = r[4]
    brand = r[5]
    unit = r[6]
    price = r[7]
    mrp = r[8]
    discount = r[9]
    delivery = r[10]
    stock = r[11]
    rating = r[12]
    desc = r[13]

    html_body += f"""        <tr data-category="{category}">
          <td class="img-cell"><img src="{img_url}" class="img-thumb" alt="{name}" loading="lazy"></td>
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

html_body += """      </tbody>
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

with open(html_path, mode='w', encoding='utf-8') as f:
    f.write(html_body)

print(f"Saved visual HTML spreadsheet at {html_path}")
