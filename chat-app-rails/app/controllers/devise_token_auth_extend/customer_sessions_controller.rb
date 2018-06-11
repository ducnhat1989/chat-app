module DeviseTokenAuthExtend
  class CustomerSessionsController < DeviseTokenAuth::SessionsController
    def create
      # Check
      field = (resource_params.keys.map(&:to_sym) & resource_class.authentication_keys).first

      @resource = nil
      if field
        q_value = get_case_insensitive_field_from_resource_params(field)

        @resource = find_resource(field, q_value)
      end

      if @resource && valid_params?(field, q_value) && (!@resource.respond_to?(:active_for_authentication?) || @resource.active_for_authentication?)
        valid_password = @resource.valid_password?(resource_params[:password])
        if (@resource.respond_to?(:valid_for_authentication?) && !@resource.valid_for_authentication? { valid_password }) || !valid_password
         return render_create_error_bad_credentials
        end
        @client_id, @token = @resource.create_token
        @resource.save

        sign_in(:user, @resource, store: false, bypass: false)

        save_device

        yield @resource if block_given?

        render_create_success
      elsif @resource && !(!@resource.respond_to?(:active_for_authentication?) || @resource.active_for_authentication?)
        if @resource.respond_to?(:locked_at) && @resource.locked_at
          render_create_error_account_locked
        else
          render_create_error_not_confirmed
        end
      else
        render_create_error_bad_credentials
      end
    end

    private
    def save_device
      device = @resource.devices.find_or_initialize_by device_type: params[:device_type]
      device.update_attributes device_token: params[:device_token]
    end
  end
end