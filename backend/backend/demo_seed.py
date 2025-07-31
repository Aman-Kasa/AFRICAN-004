from users.models import User
from inventory.models import InventoryItem
from suppliers.models import Supplier
from orders.models import PurchaseOrder
from django.utils import timezone

# Create demo users
User.objects.get_or_create(username='manager1', defaults={
    'email': 'manager1@example.com',
    'password': 'Testpass123',
    'role': 'MANAGER',
})
User.objects.get_or_create(username='staff1', defaults={
    'email': 'staff1@example.com',
    'password': 'Testpass123',
    'role': 'STAFF',
})

# Create demo suppliers
s1, _ = Supplier.objects.get_or_create(
    name='Acme Supplies',
    defaults={
        'contact_name': 'Alice Smith',
        'contact_email': 'alice@acme.com',
        'contact_phone': '+1234567890',
        'address': '123 Acme St, City',
    }
)
s2, _ = Supplier.objects.get_or_create(
    name='Global Industrial',
    defaults={
        'contact_name': 'Bob Jones',
        'contact_email': 'bob@global.com',
        'contact_phone': '+1987654321',
        'address': '456 Global Ave, Metropolis',
    }
)

# Create demo inventory items
i1, _ = InventoryItem.objects.get_or_create(
    name='Industrial Drill',
    defaults={
        'sku': 'DRL-1001',
        'quantity': 50,
        'reorder_level': 10,
    }
)
i2, _ = InventoryItem.objects.get_or_create(
    name='Safety Gloves',
    defaults={
        'sku': 'GLV-2002',
        'quantity': 200,
        'reorder_level': 50,
    }
)
i3, _ = InventoryItem.objects.get_or_create(
    name='Welding Helmet',
    defaults={
        'sku': 'HLT-3003',
        'quantity': 30,
        'reorder_level': 5,
    }
)

# Create demo purchase orders
PurchaseOrder.objects.get_or_create(
    supplier=s1,
    item=i1,
    defaults={
        'quantity': 10,
        'status': 'PENDING',
    }
)
PurchaseOrder.objects.get_or_create(
    supplier=s2,
    item=i2,
    defaults={
        'quantity': 100,
        'status': 'APPROVED',
    }
)

print('Demo data created.') 