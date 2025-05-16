
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Customer } from '@/adapters/customer.adapter';
import { Loader2 } from 'lucide-react';

/**
 * Customer schema for form validation
 */
const customerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  birthDate: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
    message: 'Please enter a valid date',
  }),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
});

/**
 * Props for CustomerDialog component
 */
type CustomerDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: z.infer<typeof customerSchema>) => void;
  customer?: Customer | null;
  isLoading?: boolean;
  mode: 'create' | 'edit';
};

/**
 * CustomerDialog Component
 * 
 * A modal dialog for creating or editing customer information
 */
const CustomerDialog: React.FC<CustomerDialogProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  customer, 
  isLoading = false, 
  mode 
}) => {
  // Initialize form with customer data or defaults
  const form = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      firstName: customer?.firstName || '',
      lastName: customer?.lastName || '',
      birthDate: customer?.birthDate 
        ? customer.birthDate.toISOString().split('T')[0] 
        : new Date().toISOString().split('T')[0],
      gender: customer?.gender || 'MALE',
    },
  });

  // Reset form when customer changes
  React.useEffect(() => {
    if (customer) {
      form.reset({
        firstName: customer.firstName,
        lastName: customer.lastName,
        birthDate: customer.birthDate.toISOString().split('T')[0],
        gender: customer.gender,
      });
    } else if (mode === 'create') {
      form.reset({
        firstName: '',
        lastName: '',
        birthDate: new Date().toISOString().split('T')[0],
        gender: 'MALE',
      });
    }
  }, [customer, mode, form]);

  // Handle form submission
  const onSubmit = (data: z.infer<typeof customerSchema>) => {
    onSave(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create Customer' : 'Edit Customer'}</DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Enter the details for the new customer.' 
              : 'Make changes to the customer information.'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* First Name Field */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Last Name Field */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Birth Date Field */}
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birth Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Gender Field */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Display UUID if in edit mode */}
            {mode === 'edit' && customer?.uuid && (
              <div className="space-y-1">
                <label className="text-sm font-medium">UUID (read-only)</label>
                <div className="p-2 bg-muted rounded-md font-mono text-xs break-all">
                  {customer.uuid}
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {mode === 'create' ? 'Creating...' : 'Saving...'}
                  </>
                ) : (
                  mode === 'create' ? 'Create' : 'Save Changes'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDialog;
