import React, { useEffect } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Reading } from '@/adapters/reading.adapter';
import { Customer } from '@/adapters/customer.adapter';
import { Loader2 } from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomers';
import { KindOfMeter } from '@/types/api';

/**
 * Reading schema for form validation
 */
const readingSchema = z.object({
  customerId: z.string().optional(),
  dateOfReading: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
    message: 'Please enter a valid date',
  }),
  meterId: z.string().min(1, 'Meter ID is required'),
  meterCount: z.coerce.number().min(0, 'Meter count must be a positive number'),
  kindOfMeter: z.enum(['HEIZUNG', 'STROM', 'WASSER', 'UNBEKANNT']),
  substitute: z.boolean().default(false),
  comment: z.string().optional(),
  
  // Customer fields (used when creating a new customer)
  customerFirstName: z.string().optional(),
  customerLastName: z.string().optional(),
  customerBirthDate: z.string().optional(),
  customerGender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  createNewCustomer: z.boolean().default(false),
});

/**
 * Props for ReadingDialog component
 */
type ReadingDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: z.infer<typeof readingSchema>) => void;
  reading?: Reading | null;
  isLoading?: boolean;
  mode: 'create' | 'edit';
};

/**
 * ReadingDialog Component
 * 
 * A modal dialog for creating or editing meter readings
 * Supports creating a new customer or selecting an existing one
 */
const ReadingDialog: React.FC<ReadingDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  reading,
  isLoading = false,
  mode,
}) => {
  // Get customers for dropdown selection
  const { customers, isLoading: customersLoading } = useCustomers();
  
  // Initialize form with reading data or defaults
  const form = useForm<z.infer<typeof readingSchema>>({
    resolver: zodResolver(readingSchema),
    defaultValues: {
      customerId: reading?.customer?.uuid || '',
      dateOfReading: reading?.dateOfReading
        ? reading.dateOfReading.toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      meterId: reading?.meterId || '',
      meterCount: reading ? reading.meterCount : 0,
      kindOfMeter: reading?.kindOfMeter as KindOfMeter || 'STROM',
      substitute: reading?.substitute || false,
      comment: reading?.comment || '',
      createNewCustomer: false,
    },
  });

  // Get current form values to control conditional fields
  const createNewCustomer = form.watch('createNewCustomer');

  // Reset form when reading changes
  useEffect(() => {
    if (reading) {
      form.reset({
        customerId: reading.customer?.uuid || '',
        dateOfReading: reading.dateOfReading.toISOString().split('T')[0],
        meterId: reading.meterId,
        meterCount: reading.meterCount,
        kindOfMeter: reading.kindOfMeter as KindOfMeter,
        substitute: reading.substitute,
        comment: reading.comment || '',
        createNewCustomer: false,
      });
    } else if (mode === 'create') {
      form.reset({
        customerId: '',
        dateOfReading: new Date().toISOString().split('T')[0],
        meterId: '',
        meterCount: 0,
        kindOfMeter: 'STROM',
        substitute: false,
        comment: '',
        createNewCustomer: false,
        customerFirstName: '',
        customerLastName: '',
        customerBirthDate: new Date().toISOString().split('T')[0],
        customerGender: 'MALE',
      });
    }
  }, [reading, mode, form]);

  // Handle form submission
  const onSubmit = (data: z.infer<typeof readingSchema>) => {
    onSave(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create Meter Reading' : 'Edit Meter Reading'}</DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Enter the details for the new meter reading.'
              : 'Make changes to the meter reading information.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Customer Selection Section */}
            <div className="space-y-4 border-b pb-4">
              <h3 className="font-medium">Customer Information</h3>
              
              {/* Option to create new customer */}
              {mode === 'create' && (
                <FormField
                  control={form.control}
                  name="createNewCustomer"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Create new customer</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              )}
              
              {/* Existing customer selection */}
              {!createNewCustomer && (
                <FormField
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isLoading || customersLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select customer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {customers.map((customer: Customer) => (
                            <SelectItem key={customer.uuid} value={customer.uuid}>
                              {customer.firstName} {customer.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              {/* New customer fields */}
              {createNewCustomer && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="customerFirstName"
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
                  
                  <FormField
                    control={form.control}
                    name="customerLastName"
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
                  
                  <FormField
                    control={form.control}
                    name="customerBirthDate"
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
                  
                  <FormField
                    control={form.control}
                    name="customerGender"
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
                </div>
              )}
            </div>
            
            {/* Reading Information Section */}
            <div className="space-y-4">
              <h3 className="font-medium">Reading Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Date of Reading Field */}
                <FormField
                  control={form.control}
                  name="dateOfReading"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reading Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Meter Type Field */}
                <FormField
                  control={form.control}
                  name="kindOfMeter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meter Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select meter type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="HEIZUNG">Heating</SelectItem>
                          <SelectItem value="STROM">Electricity</SelectItem>
                          <SelectItem value="WASSER">Water</SelectItem>
                          <SelectItem value="UNBEKANNT">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Meter ID Field */}
                <FormField
                  control={form.control}
                  name="meterId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meter ID</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Meter Count Field */}
                <FormField
                  control={form.control}
                  name="meterCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meter Count</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Substitute Reading Field */}
              <FormField
                control={form.control}
                name="substitute"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>This is a substitute reading</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              {/* Comment Field */}
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comment (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Display UUID if in edit mode */}
              {mode === 'edit' && reading?.uuid && (
                <div className="space-y-1">
                  <label className="text-sm font-medium">UUID (read-only)</label>
                  <div className="p-2 bg-muted rounded-md font-mono text-xs break-all">
                    {reading.uuid}
                  </div>
                </div>
              )}
            </div>
            
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

export default ReadingDialog;
