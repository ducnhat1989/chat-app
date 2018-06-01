class CreateDevices < ActiveRecord::Migration[5.2]
  def change
    create_table :devices do |t|
      t.string :device_type
      t.string :device_token
      t.references :user, index: true

      t.timestamps
    end
  end
end
